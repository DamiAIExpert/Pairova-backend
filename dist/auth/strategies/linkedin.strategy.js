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
let LinkedInStrategy = class LinkedInStrategy extends (0, passport_1.PassportStrategy)(passport_linkedin_oauth2_1.Strategy, 'linkedin') {
    configService;
    authService;
    constructor(configService, authService) {
        super({
            clientID: configService.get('LINKEDIN_CLIENT_ID'),
            clientSecret: configService.get('LINKEDIN_CLIENT_SECRET'),
            callbackURL: configService.get('LINKEDIN_CALLBACK_URL') || 'http://localhost:3007/auth/linkedin/callback',
            scope: ['r_emailaddress', 'r_liteprofile'],
            state: true,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const { id, emails, name, photos } = profile;
            const email = emails && emails.length > 0 ? emails[0].value : null;
            if (!email) {
                return done(new Error('No email found in LinkedIn profile'), null);
            }
            const userData = {
                oauthProvider: 'linkedin',
                oauthId: id,
                email,
                firstName: name?.givenName || '',
                lastName: name?.familyName || '',
                photoUrl: photos && photos.length > 0 ? photos[0].value : null,
                oauthProfile: profile._json,
            };
            const user = await this.authService.findOrCreateOAuthUser(userData);
            done(null, user);
        }
        catch (error) {
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