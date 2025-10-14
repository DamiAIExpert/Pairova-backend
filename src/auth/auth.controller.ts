import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { LocalAuthGuard } from './strategies/guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    // passwordHash should already be excluded at the entity layer
    return user;
  }

  // NOTE: Add refresh and logout endpoints here if needed.
}
