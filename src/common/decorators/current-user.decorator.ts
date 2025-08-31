// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/shared/user.entity';

/**
 * @const CurrentUser
 * @description A custom parameter decorator to extract the authenticated user object from the request.
 * This decorator simplifies accessing the user details that were attached to the request by
 * the `JwtAuthGuard` after successful token validation.
 *
 * It helps to keep controller methods clean and avoids magic strings like `request.user`.
 *
 * @param {unknown} data - Optional data passed to the decorator (not used here).
 * @param {ExecutionContext} ctx - The execution context of the current request.
 * @returns {User} The authenticated user object, or null if not present.
 *
 * @example
 * ```typescript
 * // profile.controller.ts
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 * import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 * import { CurrentUser } from '../common/decorators/current-user.decorator';
 * import { User } from '../users/shared/user.entity';
 *
 * \@Controller('profile')
 * \@UseGuards(JwtAuthGuard)
 * export class ProfileController {
 *
 * \@Get('me')
 * getProfile(@CurrentUser() user: User) {
 * // The `user` parameter is now strongly-typed and contains the authenticated user's data.
 * return user;
 * }
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

