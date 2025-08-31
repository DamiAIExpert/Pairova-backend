import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/shared/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/shared/user.entity';

/**
 * @class JwtStrategy
 * @extends PassportStrategy
 * @description A Passport strategy for validating JWTs. This is the primary mechanism
 * for securing endpoints in the application. It extracts the token from the request,
 * verifies its signature, and uses the payload to retrieve the user from the database.
 *
 * @how-to-use This strategy is automatically invoked by the `JwtAuthGuard`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @constructor
   * @param {ConfigService} configService - Service for accessing application configuration (e.g., .env variables).
   * @param {UsersService} usersService - Service for interacting with user data in the database.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // 1. Specify how to extract the JWT from the request.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Prevent expired tokens from being accepted. This should always be false in production.
      ignoreExpiration: false,
      // 3. Securely load the JWT secret from environment variables.
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * @method validate
   * @description This method is called by Passport after it has successfully verified the JWT's
   * signature and expiration. Its purpose is to transform the token payload into a user object
   * that will be attached to the `request` object (as `request.user`).
   *
   * @param {JwtPayload} payload - The decoded payload from the JWT.
   * @returns {Promise<User>} The full user entity fetched from the database.
   * @throws {UnauthorizedException} If no user is found corresponding to the token's subject (sub).
   */
  async validate(payload: JwtPayload): Promise<User> {
    // Use the 'sub' (subject) claim from the token payload, which holds the user's unique ID.
    const user = await this.usersService.findOneById(payload.sub);

    // If the user associated with the token no longer exists (e.g., account was deleted),
    // the token is considered invalid.
    if (!user) {
      throw new UnauthorizedException(
        'Access denied. The user belonging to this token no longer exists.',
      );
    }

    // The returned user object will be attached to the request by the PassportModule.
    // Guards like RolesGuard can then access `request.user` to check for permissions.
    // It's crucial to return the full user object so that downstream logic has all necessary info.
    return user;
  }
}
