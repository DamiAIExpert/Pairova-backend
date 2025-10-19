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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const local_auth_guard_1 = require("./strategies/guards/local-auth.guard");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const request_password_reset_dto_1 = require("./dto/request-password-reset.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const jwt_auth_guard_1 = require("./strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/shared/user.entity");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(user, _loginDto) {
        return this.authService.login(user);
    }
    async register(registerDto) {
        return this.authService.register(registerDto.email, registerDto.password, registerDto.role);
    }
    async forgotPassword(dto) {
        await this.authService.requestPasswordReset(dto.email);
    }
    async resetPassword(dto) {
        await this.authService.resetPassword(dto.email, dto.token, dto.newPassword);
    }
    getProfile(user) {
        return user;
    }
    async logout(user) {
        return this.authService.logout();
    }
    async verifyEmail(dto) {
        return this.authService.verifyEmail(dto.token);
    }
    async resendVerification(dto) {
        return this.authService.resendVerificationEmail(dto.email);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User Login',
        description: `
Authenticate a user with email and password. Returns JWT tokens for API access.

**Frontend Integration:**
\`\`\`javascript
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!'
  })
});

if (response.ok) {
  const { access_token, refresh_token, user } = await response.json();
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  // Redirect to dashboard
} else {
  const error = await response.json();
  console.error('Login failed:', error.message);
}
\`\`\`
    `
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful, returns access and refresh tokens.',
        schema: {
            example: {
                statusCode: 200,
                message: 'Login successful',
                data: {
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    user: {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        email: 'john.doe@example.com',
                        role: 'APPLICANT',
                        profile: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials or account not found.',
        schema: {
            example: {
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error - invalid email format or missing fields.',
        schema: {
            example: {
                statusCode: 400,
                message: 'Validation failed',
                error: 'Bad Request',
                details: [
                    {
                        field: 'email',
                        message: 'email must be a valid email address'
                    }
                ]
            }
        }
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User Registration' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Registration successful, returns new user and tokens.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request, validation failed.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request Password Reset' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Password reset email has been sent successfully.',
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_password_reset_dto_1.RequestPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reset Password with Token' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Password has been reset successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid token or email.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Current User Profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns the authenticated user's profile.",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User Logout' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User logged out successfully.',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify Email Address' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email verified successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired verification token.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Resend Email Verification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification email sent successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User not found or email already verified.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_password_reset_dto_1.RequestPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'New access token generated successfully.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map