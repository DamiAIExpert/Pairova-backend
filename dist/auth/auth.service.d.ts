import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/shared/user.service';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { OtpService } from './otp/otp.service';
import { EmailService } from '../notifications/email.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly otpService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, otpService: OtpService, emailService: EmailService);
    validateUser(email: string, pass: string): Promise<Omit<User, 'passwordHash'> | null>;
    login(user: User): {
        accessToken: string;
    };
    register(email: string, password: string, role: Role): Promise<User>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(email: string, token: string, newPassword: string): Promise<void>;
    verifyUserFromToken(token: string): Promise<User>;
    logout(): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
