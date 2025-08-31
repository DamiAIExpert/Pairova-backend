import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class LocalAuthGuard
 * @extends AuthGuard('local')
 * @description A robust authentication guard that triggers the `LocalStrategy` to validate user credentials
 * (e.g., email and password) during a login attempt. This guard is purpose-built for the login endpoint.
 *
 * @how-to-use
 * Apply this guard using `@UseGuards(LocalAuthGuard)` directly on the login route handler within
 * your authentication controller. It will automatically invoke the `validate` method of your `LocalStrategy`.
 *
 * @example
 * ```typescript
 * // auth.controller.ts
 * import { Controller, Post, Request, UseGuards } from '@nestjs/common';
 * import { LocalAuthGuard } from './guards/local-auth.guard';
 * import { AuthService } from './auth.service';
 *
 * \@Controller('auth')
 * export class AuthController {
 * constructor(private readonly authService: AuthService) {}
 *
 * \@UseGuards(LocalAuthGuard)
 * \@Post('login')
 * async login(\@Request() req) {
 * // If this point is reached, the user has been successfully validated
 * // by the LocalStrategy, and req.user is populated.
 * return this.authService.login(req.user);
 * }
 * }
 * ```
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * @method handleRequest
   * @description Overrides the default `handleRequest` to provide a more specific and user-friendly error message.
   * If the LocalStrategy's `validate` method returns an error or a falsy user object, this method
   * throws a clear `UnauthorizedException`, which is more informative than the default "Unauthorized" response.
   *
   * @param {any} err - An error object thrown from the passport strategy.
   * @param {any} user - The user payload returned from the strategy's `validate` method on success.
   * @param {any} info - Additional information or error details, if any.
   * @returns {any} The authenticated user payload, which will be attached to the request object.
   * @throws {UnauthorizedException} If credentials are invalid or any other authentication error occurs.
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // Provide a clear, consistent error message for all login failures.
      // This prevents attackers from guessing whether a username exists.
      throw (
        err ||
        new UnauthorizedException(
          'Authentication failed: Invalid credentials provided.',
        )
      );
    }
    return user;
  }
}

