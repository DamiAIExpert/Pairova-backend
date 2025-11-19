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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
const role_enum_1 = require("../../common/enums/role.enum");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    authService;
    constructor(configService, authService) {
        const callbackURL = configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3007/auth/google/callback';
        console.log('🔍 Google OAuth Callback URL:', callbackURL);
        console.log('🔍 GOOGLE_CALLBACK_URL env var:', configService.get('GOOGLE_CALLBACK_URL'));
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: callbackURL,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        try {
            const { id, emails, name, photos } = profile;
            const email = emails && emails.length > 0 ? emails[0].value : null;
            if (!email) {
                return done(new Error('No email found in Google profile'), null);
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
                console.log('🔍 Retrieved role from session in strategy:', oauthRole, '->', role);
            }
            const userData = {
                oauthProvider: 'google',
                oauthId: id,
                email,
                firstName: name?.givenName || '',
                lastName: name?.familyName || '',
                photoUrl: photos && photos.length > 0 ? photos[0].value : null,
                oauthProfile: profile._json,
                role: role,
            };
            const user = await this.authService.findOrCreateOAuthUser(userData);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map