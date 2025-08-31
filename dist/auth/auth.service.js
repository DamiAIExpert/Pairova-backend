"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../users/shared/user.service");
const otp_service_1 = require("./otp/otp.service");
const otp_channel_enum_1 = require("../common/enums/otp-channel.enum");
const email_service_1 = require("../notifications/email.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    otpService;
    emailService;
    constructor(usersService, jwtService, otpService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.emailService = emailService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (user && (await bcrypt_1.default.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    login(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { accessToken: this.jwtService.sign(payload) };
    }
    async register(email, password, role) {
        const existing = await this.usersService.findByEmailWithPassword(email);
        if (existing)
            throw new common_1.BadRequestException('Email already in use.');
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        return this.usersService.create({ email, passwordHash, role });
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
        const newPasswordHash = await bcrypt_1.default.hash(newPassword, 10);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UsersService,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map