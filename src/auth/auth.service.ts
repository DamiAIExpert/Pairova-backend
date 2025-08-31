// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/shared/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { OtpService } from './otp/otp.service';
import { OtpChannel } from '../common/enums/otp-channel.enum';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result as Omit<User, 'passwordHash'>;
    }
    return null;
  }

  login(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(email: string, password: string, role: Role): Promise<User> {
    const existing = await this.usersService.findByEmailWithPassword(email);
    if (existing) throw new BadRequestException('Email already in use.');

    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, passwordHash, role });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return; // don't leak user existence

    // OtpService.generateOtp -> { id, code }
    const { code } = await this.otpService.generateOtp(user.id, OtpChannel.EMAIL);

    await this.emailService.sendFromTemplate(
      user.email,
      'Your Password Reset Code',
      'password-reset',
      { code, name: user.email },
    );
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) throw new BadRequestException('Invalid reset request.');

    // validateOtp(userId, token, channel?) -> returns Otp | null
    const otpRecord = await this.otpService.validateOtp(user.id, token, OtpChannel.EMAIL);
    if (!otpRecord) throw new BadRequestException('Invalid or expired reset token.');

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, newPasswordHash);

    // consumeOtp expects the OTP id
    await this.otpService.consumeOtp(otpRecord.id);
  }

  async verifyUserFromToken(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token);
    const user = await this.usersService.findOneByIdWithProfile(payload.sub);
    if (!user) throw new UnauthorizedException('User not found.');
    return user;
  }
}
