import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class OtpGuard
 * @extends AuthGuard('otp')
 * @description A robust authentication guard that triggers the `OtpStrategy` to validate a one-time password.
 * This guard is designed for endpoints that require OTP verification, such as email confirmation,
 * password resets, or two-factor authentication flows.
 *
 * @how-to-use
 * Apply this guard using `@UseGuards(OtpGuard)` on the specific route that handles OTP submission.
 * It will automatically invoke the `validate` method of your `OtpStrategy`.
 *
 * @example
 * ```typescript
 * // auth.controller.ts
 * import { Controller, Post, Body, UseGuards } from '@nestjs/common';
 * import { OtpGuard } from './guards/otp.guard';
 * import { VerifyOtpDto } from './dto/verify-otp.dto';
 *
 * \@Controller('auth')
 * export class AuthController {
 *
 * \@UseGuards(OtpGuard)
 * \@Post('verify-email')
 * async verifyEmail(\@Body() verifyOtpDto: VerifyOtpDto) {
 * // If this point is reached, the OTP was valid.
 * // The OtpStrategy would have returned the user or a success payload.
 * return { message: 'Email successfully verified.' };
 * }
 * }
 * ```
 */
@Injectable()
export class OtpGuard extends AuthGuard('otp') {
  /**
   * @method handleRequest
   * @description Overrides the default `handleRequest` to provide more specific error feedback for OTP failures.
   * If the OtpStrategy's `validate` method fails, this method throws a clear `UnauthorizedException`.
   *
   * @param {any} err - An error object thrown from the passport strategy.
   * @param {any} user - The payload returned from the strategy's `validate` method on success.
   * @param {any} info - Additional information or error details.
   * @returns {any} The validated payload, to be attached to the request object.
   * @throws {UnauthorizedException} If the OTP is invalid, expired, or another error occurs.
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'OTP validation failed: The provided code is invalid or has expired.',
        )
      );
    }
    return user;
  }
}
