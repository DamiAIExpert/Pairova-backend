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

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access and refresh tokens.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized, invalid credentials.' })
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
