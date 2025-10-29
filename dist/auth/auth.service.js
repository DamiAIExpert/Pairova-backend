"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const user_service_1 = require("../users/shared/user.service");
const applicant_service_1 = require("../users/applicant/applicant.service");
const nonprofit_service_1 = require("../users/nonprofit/nonprofit.service");
const role_enum_1 = require("../common/enums/role.enum");
const otp_service_1 = require("./otp/otp.service");
const otp_channel_enum_1 = require("../common/enums/otp-channel.enum");
const email_service_1 = require("../notifications/email.service");
const url_helper_1 = require("../common/utils/url.helper");
let AuthService = class AuthService {
    usersService;
    applicantService;
    nonprofitService;
    jwtService;
    otpService;
    emailService;
    configService;
    constructor(usersService, applicantService, nonprofitService, jwtService, otpService, emailService, configService) {
        this.usersService = usersService;
        this.applicantService = applicantService;
        this.nonprofitService = nonprofitService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
        const { passwordHash, ...userWithoutPassword } = userWithProfile;
        let firstName;
        let lastName;
        let orgName;
        if (userWithProfile.applicantProfile) {
            firstName = userWithProfile.applicantProfile.firstName;
            lastName = userWithProfile.applicantProfile.lastName;
        }
        else if (userWithProfile.nonprofitOrg) {
            orgName = userWithProfile.nonprofitOrg.orgName;
        }
        return {
            accessToken,
            refreshToken,
            user: {
                ...userWithoutPassword,
                firstName,
                lastName,
                orgName,
            },
        };
    }
    async register(email, password, role, fullName, orgName) {
        const existing = await this.usersService.findByEmailWithPassword(email);
        if (existing)
            throw new common_1.BadRequestException('Email already in use.');
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({ email, passwordHash, role });
        try {
            if (role === role_enum_1.Role.APPLICANT && fullName) {
                const nameParts = fullName.trim().split(/\s+/);
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                await this.applicantService.createProfile(user.id);
                if (firstName) {
                    const profile = await this.applicantService.getProfile(user);
                    profile.firstName = firstName;
                    profile.lastName = lastName;
                    await this.applicantService.updateProfile(user, profile);
                }
            }
            else if (role === role_enum_1.Role.NONPROFIT && orgName) {
                await this.nonprofitService.createProfile(user.id, orgName);
            }
            else {
                if (role === role_enum_1.Role.APPLICANT) {
                    await this.applicantService.createProfile(user.id);
                }
                else if (role === role_enum_1.Role.NONPROFIT) {
                    const defaultOrgName = email.split('@')[0];
                    await this.nonprofitService.createProfile(user.id, defaultOrgName);
                }
            }
        }
        catch (error) {
            console.error('Failed to create profile:', error);
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        this.otpService.generateOtp(user.id, otp_channel_enum_1.OtpChannel.EMAIL)
            .then(({ code }) => {
            const displayName = fullName || orgName || email.split('@')[0];
            const isAdmin = role === role_enum_1.Role.ADMIN;
            const verificationLink = url_helper_1.UrlHelper.generateVerificationLink(this.configService, email, code, isAdmin);
            return this.emailService.sendFromTemplate(user.email, 'Verify Your Email', 'email-verification', {
                code,
                name: displayName,
                verificationLink,
            });
        })
            .catch((error) => {
            console.error('Failed to send verification email:', error);
        });
        const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
        const { passwordHash: _, ...userWithoutPassword } = userWithProfile;
        let firstName;
        let lastName;
        let organizationName;
        if (userWithProfile.applicantProfile) {
            firstName = userWithProfile.applicantProfile.firstName;
            lastName = userWithProfile.applicantProfile.lastName;
        }
        else if (userWithProfile.nonprofitOrg) {
            organizationName = userWithProfile.nonprofitOrg.orgName;
        }
        return {
            accessToken,
            refreshToken,
            user: {
                ...userWithoutPassword,
                firstName,
                lastName,
                orgName: organizationName,
            },
        };
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user)
            return;
        const { code } = await this.otpService.generateOtp(user.id, otp_channel_enum_1.OtpChannel.EMAIL);
        await this.emailService.sendFromTemplate(user.email, 'Your Password Reset Code', 'password-reset', { code, name: user.email });
    }
    async resetPassword(email, token, newPassword) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user)
            throw new common_1.BadRequestException('Invalid reset request.');
        const otpRecord = await this.otpService.validateOtp(user.id, token, otp_channel_enum_1.OtpChannel.EMAIL);
        if (!otpRecord)
            throw new common_1.BadRequestException('Invalid or expired reset token.');
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(user.id, newPasswordHash);
        await this.otpService.consumeOtp(otpRecord.id);
    }
    async verifyUserFromToken(token) {
        const payload = this.jwtService.verify(token);
        const user = await this.usersService.findOneByIdWithProfile(payload.sub);
        if (!user)
            throw new common_1.UnauthorizedException('User not found.');
        return user;
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
    async verifyEmail(email, token) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const otpRecord = await this.otpService.validateOtp(user.id, token, otp_channel_enum_1.OtpChannel.EMAIL);
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        await this.usersService.markEmailAsVerified(user.id);
        await this.otpService.consumeOtp(otpRecord.id);
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const { code } = await this.otpService.generateOtp(user.id, otp_channel_enum_1.OtpChannel.EMAIL);
        const isAdmin = user.role === role_enum_1.Role.ADMIN;
        const verificationLink = url_helper_1.UrlHelper.generateVerificationLink(this.configService, email, code, isAdmin);
        await this.emailService.sendFromTemplate(user.email, 'Verify Your Email', 'email-verification', {
            code,
            name: user.email,
            verificationLink,
        });
        return { message: 'Verification email sent successfully' };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findOneByIdWithProfile(payload.sub);
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const newPayload = { sub: user.id, email: user.email, role: user.role };
            return { accessToken: this.jwtService.sign(newPayload) };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async completeOnboarding(userId) {
        await this.usersService.markOnboardingComplete(userId);
        return { message: 'Onboarding completed successfully' };
    }
    async findOrCreateOAuthUser(oauthData) {
        let user = await this.usersService.findByOAuthProvider(oauthData.oauthProvider, oauthData.oauthId);
        if (!user) {
            user = await this.usersService.findByEmailWithPassword(oauthData.email);
            if (user) {
                await this.usersService.linkOAuthAccount(user.id, {
                    oauthProvider: oauthData.oauthProvider,
                    oauthId: oauthData.oauthId,
                    oauthProfile: oauthData.oauthProfile,
                });
            }
            else {
                user = await this.usersService.create({
                    email: oauthData.email,
                    passwordHash: null,
                    role: role_enum_1.Role.APPLICANT,
                    oauthProvider: oauthData.oauthProvider,
                    oauthId: oauthData.oauthId,
                    oauthProfile: oauthData.oauthProfile,
                    isVerified: true,
                });
                try {
                    await this.applicantService.createProfile(user.id);
                    if (oauthData.firstName || oauthData.lastName) {
                        const profile = await this.applicantService.getProfile(user);
                        profile.firstName = oauthData.firstName || '';
                        profile.lastName = oauthData.lastName || '';
                        if (oauthData.photoUrl) {
                            profile.photoUrl = oauthData.photoUrl;
                        }
                        await this.applicantService.updateProfile(user, profile);
                    }
                }
                catch (error) {
                    console.error('Failed to create OAuth user profile:', error);
                }
            }
        }
        const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
        const payload = {
            sub: userWithProfile.id,
            email: userWithProfile.email,
            role: userWithProfile.role
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const { passwordHash: _, ...userWithoutPassword } = userWithProfile;
        let firstName;
        let lastName;
        let orgName;
        if (userWithProfile.applicantProfile) {
            firstName = userWithProfile.applicantProfile.firstName;
            lastName = userWithProfile.applicantProfile.lastName;
        }
        else if (userWithProfile.nonprofitOrg) {
            orgName = userWithProfile.nonprofitOrg.orgName;
        }
        return {
            accessToken,
            refreshToken,
            user: {
                ...userWithoutPassword,
                firstName,
                lastName,
                orgName,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UsersService,
        applicant_service_1.ApplicantService,
        nonprofit_service_1.NonprofitService,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        email_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map