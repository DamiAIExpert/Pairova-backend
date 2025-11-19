import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Role } from '../../common/enums/role.enum';

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
      scope: ['openid', 'profile', 'email'], // Updated to use OpenID Connect scopes (r_emailaddress and r_liteprofile are deprecated)
      state: true,
      passReqToCallback: true, // Enable passing request to validate method
      // Use OpenID Connect endpoints
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      profileURL: 'https://api.linkedin.com/v2/userinfo', // OpenID Connect userinfo endpoint
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      console.log('🔍 LinkedIn profile data:', JSON.stringify(profile, null, 2));
      console.log('🔍 LinkedIn profile._json:', JSON.stringify(profile._json, null, 2));
      
      // OpenID Connect profile format uses different structure
      // Handle both old format (emails array) and new OpenID Connect format (email field)
      let email: string | null = null;
      let firstName: string = '';
      let lastName: string = '';
      let photoUrl: string | null = null;
      let oauthId: string = '';

      // Check for OpenID Connect format (new)
      if (profile._json) {
        const json = profile._json;
        // OpenID Connect uses 'sub' as the user identifier
        oauthId = json.sub || profile.id || json.id || '';
        email = json.email || null;
        firstName = json.given_name || json.givenName || '';
        lastName = json.family_name || json.familyName || '';
        photoUrl = json.picture || null;
      }

      // Fallback to old format if OpenID Connect fields not found
      if (!email && profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value || null;
      }
      if (!firstName && profile.name?.givenName) {
        firstName = profile.name.givenName;
      }
      if (!lastName && profile.name?.familyName) {
        lastName = profile.name.familyName;
      }
      if (!photoUrl && profile.photos && profile.photos.length > 0) {
        photoUrl = profile.photos[0].value || null;
      }
      if (!oauthId && profile.id) {
        oauthId = profile.id;
      }

      if (!email) {
        return done(new Error('No email found in LinkedIn profile'), null);
      }

      if (!oauthId) {
        return done(new Error('No user ID found in LinkedIn profile'), null);
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
        console.log('🔍 Retrieved role from session in LinkedIn strategy:', oauthRole, '->', role);
      }

      // Extract user data from LinkedIn profile
      const userData = {
        oauthProvider: 'linkedin',
        oauthId: oauthId,
        email,
        firstName,
        lastName,
        photoUrl,
        oauthProfile: profile._json || profile,
        role: role, // Pass role to create user with correct role from start
      };

      console.log('🔍 Extracted LinkedIn user data:', userData);

      // Find or create user with role
      const user = await this.authService.findOrCreateOAuthUser(userData);

      done(null, user);
    } catch (error) {
      console.error('❌ LinkedIn OAuth validation error:', error);
      done(error, null);
    }
  }
}



