import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(user: User, _loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            firstName: string;
            lastName: string;
            orgName: string;
            id: string;
            role: Role;
            email: string;
            phone: string;
            isVerified: boolean;
            hasCompletedOnboarding: boolean;
            emailVerificationToken: string;
            oauthProvider: string;
            oauthId: string;
            oauthProfile: any;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
            applicantProfile: import("../users/applicant/applicant.entity").ApplicantProfile;
            nonprofitOrg: import("../users/nonprofit/nonprofit.entity").NonprofitOrg;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            firstName: string;
            lastName: string;
            orgName: string;
            id: string;
            role: Role;
            email: string;
            phone: string;
            isVerified: boolean;
            hasCompletedOnboarding: boolean;
            emailVerificationToken: string;
            oauthProvider: string;
            oauthId: string;
            oauthProfile: any;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
            applicantProfile: import("../users/applicant/applicant.entity").ApplicantProfile;
            nonprofitOrg: import("../users/nonprofit/nonprofit.entity").NonprofitOrg;
        };
    }>;
    forgotPassword(dto: RequestPasswordResetDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    getProfile(user: User): User;
    logout(user: User): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(dto: RequestPasswordResetDto): Promise<{
        message: string;
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    completeOnboarding(user: User): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    linkedinAuth(): Promise<void>;
    linkedinAuthCallback(req: Request, res: Response): Promise<void>;
}
