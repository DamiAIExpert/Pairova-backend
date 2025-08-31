import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * @class RolesGuard
 * @implements CanActivate
 * @description A guard that enforces role-based access control (RBAC). It checks if the current user's
 * role is included in the list of roles required to access a specific endpoint.
 * This guard should be used in conjunction with a primary authentication guard (like `JwtAuthGuard`)
 * which is responsible for validating the user's token and attaching the user payload to the request.
 *
 * @how-to-use
 * 1. Ensure `JwtAuthGuard` (or a similar auth guard) is applied globally or on the controller/route.
 * 2. Apply this guard: `@UseGuards(RolesGuard)`.
 * 3. Decorate the route handler with `@Roles(Role.ADMIN, Role.NONPROFIT, ...)` to specify allowed roles.
 *
 * @requires `Reflector` to read metadata set by the `@Roles` decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * @method canActivate
   * @description Determines if the current user is authorized to access the endpoint based on their role.
   *
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean} `true` if the user has a permitted role, otherwise throws a `ForbiddenException`.
   * @throws {ForbiddenException} If the user does not have any of the required roles.
   */
  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the metadata attached by the @Roles decorator.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required for this endpoint, allow access.
    // This makes the guard safe to apply globally; routes without a @Roles decorator are not blocked.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. Get the user object from the request.
    // This assumes a preceding authentication guard (e.g., JwtAuthGuard) has already
    // validated the user and attached the payload to the request.
    const { user } = context.switchToHttp().getRequest();

    // If there's no user object, access is denied (should be caught by an auth guard, but good to be safe).
    if (!user || !user.role) {
      throw new ForbiddenException(
        'Access denied. User information is missing.',
      );
    }

    // 3. Check if the user's role is included in the list of required roles.
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (hasRequiredRole) {
      return true; // The user has the required role, allow access.
    } else {
      // The user does not have the required role, deny access.
      throw new ForbiddenException(
        `Access denied. You do not have the required permissions (${requiredRoles.join(
          ', ',
        )}) to access this resource.`,
      );
    }
  }
}
