import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Role } from '../../common/enums/role.enum';
import { oauthRoleStore } from '../strategies/guards/google-auth.guard';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3007/auth/google/callback';
    console.log('🔍 Google OAuth Callback URL:', callbackURL);
    console.log('🔍 GOOGLE_CALLBACK_URL env var:', configService.get<string>('GOOGLE_CALLBACK_URL'));
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true, // Enable passing request to validate method
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;

      const email = emails && emails.length > 0 ? emails[0].value : null;
      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Get role from session if available
      let role: Role | undefined;
      if (req && req.session) {
        const oauthRole = (req.session as any).oauthRole;
        if (oauthRole === 'nonprofit') {
          role = Role.NONPROFIT;
        } else if (oauthRole === 'applicant') {
          role = Role.APPLICANT;
        }
        console.log('🔍 Retrieved role from session in strategy:', oauthRole, '->', role);
      }

      // Extract user data from Google profile
      const userData = {
        oauthProvider: 'google',
        oauthId: id,
        email,
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        photoUrl: photos && photos.length > 0 ? photos[0].value : null,
        oauthProfile: profile._json,
        role: role, // Pass role to create user with correct role from start
      };

      // Find or create user with role
      const user = await this.authService.findOrCreateOAuthUser(userData);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}



