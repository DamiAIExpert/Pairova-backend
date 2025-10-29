"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const otp_strategy_1 = require("./strategies/otp.strategy");
const google_strategy_1 = require("./strategies/google.strategy");
const linkedin_strategy_1 = require("./strategies/linkedin.strategy");
const user_module_1 = require("../users/shared/user.module");
const applicant_module_1 = require("../users/applicant/applicant.module");
const nonprofit_module_1 = require("../users/nonprofit/nonprofit.module");
const otp_module_1 = require("./otp/otp.module");
const notifications_module_1 = require("../notifications/notifications.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'dev_secret',
                signOptions: { expiresIn: process.env.JWT_EXPIRES || '1d' },
            }),
            user_module_1.UsersModule,
            applicant_module_1.ApplicantModule,
            nonprofit_module_1.NonprofitModule,
            otp_module_1.OtpModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            otp_strategy_1.OtpStrategy,
            google_strategy_1.GoogleStrategy,
            linkedin_strategy_1.LinkedInStrategy,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map