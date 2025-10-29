import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3007/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
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

      // Extract user data from Google profile
      const userData = {
        oauthProvider: 'google',
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



