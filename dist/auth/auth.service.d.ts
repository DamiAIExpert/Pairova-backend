import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/shared/user.service';
import { ApplicantService } from '../users/applicant/applicant.service';
import { NonprofitService } from '../users/nonprofit/nonprofit.service';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { OtpService } from './otp/otp.service';
import { EmailService } from '../notifications/email.service';
export declare class AuthService {
    private readonly usersService;
    private readonly applicantService;
    private readonly nonprofitService;
    private readonly jwtService;
    private readonly otpService;
    private readonly emailService;
    private readonly configService;
    constructor(usersService: UsersService, applicantService: ApplicantService, nonprofitService: NonprofitService, jwtService: JwtService, otpService: OtpService, emailService: EmailService, configService: ConfigService);
    validateUser(email: string, pass: string): Promise<Omit<User, 'passwordHash'> | null>;
    login(user: User): Promise<{
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
    register(email: string, password: string, role: Role, fullName?: string, orgName?: string): Promise<{
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
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(email: string, token: string, newPassword: string): Promise<void>;
    verifyUserFromToken(token: string): Promise<User>;
    logout(): Promise<{
        message: string;
    }>;
    verifyEmail(email: string, token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    completeOnboarding(userId: string): Promise<{
        message: string;
    }>;
    findOrCreateOAuthUser(oauthData: {
        oauthProvider: string;
        oauthId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        photoUrl?: string;
        oauthProfile?: any;
    }): Promise<{
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
    getUserWithProfile(userId: string): Promise<User>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
