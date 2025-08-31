// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpStrategy } from './strategies/otp.strategy';

import { UsersModule } from '../users/shared/user.module';
import { OtpModule } from './otp/otp.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES || '1d' },
    }),
    UsersModule,
    OtpModule,
    NotificationsModule, // <-- this makes EmailService injectable here
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, OtpStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
