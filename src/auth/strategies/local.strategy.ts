// src/auth/strategies/local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../users/shared/user.entity';

/**
 * @class LocalStrategy
 * @description
 * Implements the local authentication strategy using email and password.
 * Used exclusively for the `/auth/login` endpoint.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * @constructor
   * @param {AuthService} authService - Injected authentication service.
   */
  constructor(private readonly authService: AuthService) {
    // Configure Passport to use "email" instead of "username"
    super({ usernameField: 'email', passwordField: 'password' });
  }

  /**
   * @method validate
   * @description
   * Automatically called by Passport during authentication.
   * Validates email and password using AuthService.
   *
   * @param {string} email - The email entered by the user.
   * @param {string} password - The password entered by the user.
   * @returns {Promise<Omit<User, 'passwordHash'>>} The validated user without the password hash.
   * @throws {UnauthorizedException} If credentials are invalid.
   */
  async validate(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    }

    // `user` already excludes the password hash in `AuthService.validateUser`
    return user;
  }
}
