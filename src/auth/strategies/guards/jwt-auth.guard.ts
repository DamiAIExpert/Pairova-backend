import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { Observable } from 'rxjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * @class JwtAuthGuard
 * @extends AuthGuard('jwt')
 * @description A world-class, robust authentication guard that protects endpoints by verifying a JWT.
 * It seamlessly integrates with a `@Public()` decorator to allow for publicly accessible routes.
 *
 * @how-to-use
 * 1. Apply globally in a module provider: `{ provide: APP_GUARD, useClass: JwtAuthGuard }`
 * 2. To protect a specific controller or route, use `@UseGuards(JwtAuthGuard)`.
 * 3. To make a route public and bypass this guard, use the `@Public()` decorator.
 *
 * @example
 * ```typescript
 * // main.ts or app.module.ts
 * providers: [
 * {
 * provide: APP_GUARD,
 * useClass: JwtAuthGuard,
 * },
 * ],
 *
 * // some.controller.ts
 * \@Controller('items')
 * export class ItemsController {
 * \@Get() // This route is protected by default
 * findAll() { ... }
 *
 * \@Public() // This route is now public
 * \@Get(':id')
 * findOne(@Param('id') id: string) { ... }
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * @method canActivate
   * @description Determines if a route is public or requires authentication.
   * It checks for the `IS_PUBLIC_KEY` metadata set by the `@Public()` decorator.
   * If the metadata is present, it allows access. Otherwise, it proceeds with the
   * standard JWT authentication flow provided by `AuthGuard`.
   * @param {ExecutionContext} context - The execution context of the incoming request.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} A boolean indicating if access is granted.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Grant access immediately if @Public() is used
    }

    // Proceed with the default JWT authentication
    return super.canActivate(context);
  }

  /**
   * @method handleRequest
   * @description Overrides the default `handleRequest` to provide more granular error handling.
   * This method is called after the JWT strategy's `validate` method. It allows us to
   * inspect the outcome and throw specific, more informative exceptions.
   * @param {any} err - An error object from the passport strategy.
   * @param {any} user - The user payload returned from the JWT strategy's `validate` method.
   * @param {any} info - Additional information, often containing the error instance.
   * @returns {any} The authenticated user payload.
   * @throws {UnauthorizedException} If authentication fails for any reason.
   */
  handleRequest(err: any, user: any, info: any) {
    if (info) {
      // Handle specific JWT errors for clearer client-side feedback
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Authentication failed: Token has expired.',
        );
      }
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException(`Authentication failed: ${info.message}`);
      }
    }

    if (err || !user) {
      // For any other errors or if the user is not found, throw a generic but clear exception.
      throw (
        err ||
        new UnauthorizedException(
          'Authentication failed: You must be logged in to access this resource.',
        )
      );
    }

    // If everything is valid, return the user payload to be injected into the request object.
    return user;
  }
}
