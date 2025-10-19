import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

/**
 * @const ROLES_KEY
 * @description A constant key used for storing and retrieving role metadata from decorators.
 * Using a constant prevents typos and ensures consistency across the application.
 */
export const ROLES_KEY = 'roles';

/**
 * @function Roles
 * @description A custom decorator for assigning required roles to a specific route handler.
 * It attaches an array of roles as metadata to the handler, which can then be accessed
 * by the `RolesGuard` to perform authorization checks.
 *
 * @param {...Role[]} roles - A list of roles that are permitted to access the decorated endpoint.
 *
 * @example
 * ```typescript
 * // admin.controller.ts
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 * import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 * import { RolesGuard } from '../common/guards/roles.guard';
 * import { Roles } from '../common/decorators/roles.decorator';
 * import { Role } from '../common/enums/role.enum';
 *
 * \@Controller('admin')
 * \@UseGuards(JwtAuthGuard, RolesGuard) // JwtAuthGuard should typically run first
 * export class AdminController {
 *
 * \@Get('dashboard')
 * \@Roles(Role.ADMIN) // This endpoint is now protected and only accessible by users with the 'ADMIN' role.
 * getDashboardData() {
 * return { message: 'Welcome to the admin dashboard!' };
 * }
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
