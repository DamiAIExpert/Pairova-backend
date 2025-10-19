// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // ✅ Replaced bcrypt with bcryptjs

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

    const otpRecord = await this.otpService.validateOtp(user.id, token, OtpChannel.EMAIL);
    if (!otpRecord) throw new BadRequestException('Invalid or expired reset token.');

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, newPasswordHash);

    await this.otpService.consumeOtp(otpRecord.id);
  }

  async verifyUserFromToken(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token);
    const user = await this.usersService.findOneByIdWithProfile(payload.sub);
    if (!user) throw new UnauthorizedException('User not found.');
    return user;
  }

  async logout(): Promise<{ message: string }> {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // In a more sophisticated system, you might maintain a blacklist of tokens
    return { message: 'Logged out successfully' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    // For now, we'll use a simple approach where the token is the user ID
    // In a production system, you'd want to use a proper JWT or OTP system
    const user = await this.usersService.findOneById(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.usersService.markEmailAsVerified(user.id);
    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const { code } = await this.otpService.generateOtp(user.id, OtpChannel.EMAIL);

    await this.emailService.sendFromTemplate(
      user.email,
      'Verify Your Email',
      'email-verification',
      { code, name: user.email },
    );

    return { message: 'Verification email sent successfully' };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneByIdWithProfile(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const newPayload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
      return { accessToken: this.jwtService.sign(newPayload) };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
