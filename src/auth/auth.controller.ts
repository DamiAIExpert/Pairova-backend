import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { LocalAuthGuard } from './strategies/guards/local-auth.guard';
import { GoogleAuthGuard } from './strategies/guards/google-auth.guard';
import { LinkedInAuthGuard } from './strategies/guards/linkedin-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { UrlHelper } from '../common/utils/url.helper';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ 
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials or account not found.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
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
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User, @Body() _loginDto: LoginDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, returns new user and tokens.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request, validation failed.' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Cast ensures we pass a Role enum value even if DTO originates from raw strings
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role as Role,
      registerDto.fullName,
      registerDto.orgName,
    );
  }

  @ApiOperation({ summary: 'Request Password Reset' })
  @ApiResponse({
    status: 204,
    description: 'Password reset email has been sent successfully.',
  })
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(dto.email);
  }

  @ApiOperation({ summary: 'Reset Password with Token' })
  @ApiResponse({ status: 204, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid token or email.' })
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email, dto.token, dto.newPassword);
  }

  @ApiOperation({ summary: 'Get Current User Profile' })
  @ApiResponse({
    status: 200,
    description: "Returns the authenticated user's profile.",
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    // Fetch user with profile relations to include firstName, lastName, orgName, etc.
    const userWithProfile = await this.authService.getUserWithProfile(user.id);
    // passwordHash should already be excluded at the entity layer
    return userWithProfile;
  }

  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: User) {
    return this.authService.logout();
  }

  @ApiOperation({ summary: 'Verify Email Address' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token.' })
  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.email, dto.token);
  }

  @ApiOperation({ summary: 'Resend Email Verification' })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully.',
  })
  @ApiResponse({ status: 400, description: 'User not found or email already verified.' })
  @Public()
  @Post('resend-verification')
  async resendVerification(@Body() dto: RequestPasswordResetDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @Public()
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiOperation({ summary: 'Complete Onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding marked as complete.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('complete-onboarding')
  async completeOnboarding(@CurrentUser() user: User) {
    return this.authService.completeOnboarding(user.id);
  }

  @ApiOperation({ summary: 'Delete User Account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser() user: User) {
    return this.authService.deleteAccount(user.id);
  }

  // ==================== OAuth Routes ====================

  @ApiOperation({ 
    summary: 'Google OAuth Login',
    description: 'Initiates Google OAuth authentication flow. Redirects to Google login page.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth consent screen.',
  })
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    console.log('🚀 Google OAuth initiated - redirecting to Google...');
    console.log('🚀 Request URL:', req.url);
    console.log('🚀 Request host:', req.headers.host);
    // Guard redirects to Google
  }

  @ApiOperation({ 
    summary: 'Google OAuth Callback',
    description: 'Handles the callback from Google OAuth. Creates or logs in user and redirects to frontend with tokens.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with authentication tokens.',
  })
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    
    // Generate OAuth callback URL dynamically
    const redirectUrl = UrlHelper.generateOAuthCallbackUrl(
      this.configService,
      user.accessToken,
      user.refreshToken,
      user.user?.role === 'admin',
    );
    
    res.redirect(redirectUrl);
  }

  @ApiOperation({ 
    summary: 'LinkedIn OAuth Login',
    description: 'Initiates LinkedIn OAuth authentication flow. Redirects to LinkedIn login page.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to LinkedIn OAuth consent screen.',
  })
  @Public()
  @Get('linkedin')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuth() {
    // Guard redirects to LinkedIn
  }

  @ApiOperation({ 
    summary: 'LinkedIn OAuth Callback',
    description: 'Handles the callback from LinkedIn OAuth. Creates or logs in user and redirects to frontend with tokens.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with authentication tokens.',
  })
  @Public()
  @Get('linkedin/callback')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    
    // Generate OAuth callback URL dynamically
    const redirectUrl = UrlHelper.generateOAuthCallbackUrl(
      this.configService,
      user.accessToken,
      user.refreshToken,
      user.user?.role === 'admin',
    );
    
    res.redirect(redirectUrl);
  }
}
