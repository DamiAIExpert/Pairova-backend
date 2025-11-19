"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
const role_enum_1 = require("../../common/enums/role.enum");
let LinkedInStrategy = class LinkedInStrategy extends (0, passport_1.PassportStrategy)(passport_linkedin_oauth2_1.Strategy, 'linkedin') {
    configService;
    authService;
    constructor(configService, authService) {
        super({
            clientID: configService.get('LINKEDIN_CLIENT_ID'),
            clientSecret: configService.get('LINKEDIN_CLIENT_SECRET'),
            callbackURL: configService.get('LINKEDIN_CALLBACK_URL') || 'http://localhost:3007/auth/linkedin/callback',
            scope: ['openid', 'profile', 'email'],
            state: true,
            passReqToCallback: true,
            authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
            tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
            profileURL: 'https://api.linkedin.com/v2/userinfo',
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        try {
            console.log('🔍 LinkedIn profile data:', JSON.stringify(profile, null, 2));
            console.log('🔍 LinkedIn profile._json:', JSON.stringify(profile._json, null, 2));
            let email = null;
            let firstName = '';
            let lastName = '';
            let photoUrl = null;
            let oauthId = '';
            if (profile._json) {
                const json = profile._json;
                oauthId = json.sub || profile.id || json.id || '';
                email = json.email || null;
                firstName = json.given_name || json.givenName || '';
                lastName = json.family_name || json.familyName || '';
                photoUrl = json.picture || null;
            }
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
            let role;
            if (req && req.session) {
                const oauthRole = req.session.oauthRole;
                if (oauthRole === 'nonprofit') {
                    role = role_enum_1.Role.NONPROFIT;
                }
                else if (oauthRole === 'applicant') {
                    role = role_enum_1.Role.APPLICANT;
                }
                console.log('🔍 Retrieved role from session in LinkedIn strategy:', oauthRole, '->', role);
            }
            const userData = {
                oauthProvider: 'linkedin',
                oauthId: oauthId,
                email,
                firstName,
                lastName,
                photoUrl,
                oauthProfile: profile._json || profile,
                role: role,
            };
            console.log('🔍 Extracted LinkedIn user data:', userData);
            const user = await this.authService.findOrCreateOAuthUser(userData);
            done(null, user);
        }
        catch (error) {
            console.error('❌ LinkedIn OAuth validation error:', error);
            done(error, null);
        }
    }
};
exports.LinkedInStrategy = LinkedInStrategy;
exports.LinkedInStrategy = LinkedInStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], LinkedInStrategy);
//# sourceMappingURL=linkedin.strategy.js.map