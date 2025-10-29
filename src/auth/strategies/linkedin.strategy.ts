import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL') || 'http://localhost:3007/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;

      const email = emails && emails.length > 0 ? emails[0].value : null;
      if (!email) {
        return done(new Error('No email found in LinkedIn profile'), null);
      }

      // Extract user data from LinkedIn profile
      const userData = {
        oauthProvider: 'linkedin',
        oauthId: id,
        email,
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        photoUrl: photos && photos.length > 0 ? photos[0].value : null,
        oauthProfile: profile._json,
      };

      // Find or create user
      const user = await this.authService.findOrCreateOAuthUser(userData);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}



