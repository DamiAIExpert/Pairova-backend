// src/auth/interfaces/jwt-payload.interface.ts
import { Role } from '../../common/enums/role.enum';

/**
 * @interface JwtPayload
 * @description Defines the shape of the data encoded within the JSON Web Token (JWT).
 * This interface is crucial for ensuring type safety when the token is decoded
 * by the `JwtStrategy` and accessed throughout the application.
 *
 * @property {string} sub - The "subject" of the token. By convention, this holds the unique
 * identifier (UUID) of the user. It's the primary piece of information used to retrieve
 * the user from the database.
 *
 * @property {string} email - The user's email address. Including it in the payload can
 * be useful for logging or quick checks without needing a database lookup, though
 * sensitive operations should always re-fetch the user record.
 *
 * @property {Role} role - The user's role (e.g., ADMIN, APPLICANT). This is essential
 * for role-based access control (RBAC) and is used directly by the `RolesGuard`.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

