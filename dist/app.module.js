"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = __importStar(require("joi"));
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./users/shared/user.module");
const applicant_module_1 = require("./users/applicant/applicant.module");
const nonprofit_module_1 = require("./users/nonprofit/nonprofit.module");
const jobs_module_1 = require("./jobs/jobs.module");
const education_module_1 = require("./profiles/education/education.module");
const experience_module_1 = require("./profiles/experience/experience.module");
const certification_module_1 = require("./profiles/certifications/certification.module");
const upload_module_1 = require("./profiles/uploads/upload.module");
const admin_module_1 = require("./admin/admin.module");
const messaging_module_1 = require("./messaging/messaging.module");
const notifications_module_1 = require("./notifications/notifications.module");
const ai_module_1 = require("./ai/ai.module");
const sms_module_1 = require("./sms/sms.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: Joi.object({
                    DATABASE_URL: Joi.string().uri().optional(),
                    DB_HOST: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
                    DB_PORT: Joi.alternatives(Joi.string(), Joi.number()).default(5432),
                    DB_USERNAME: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
                    DB_PASSWORD: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
                    DB_DATABASE: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
                    DB_SYNCHRONIZE: Joi.boolean().default(false),
                    DB_LOGGING: Joi.boolean().default(true),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const databaseUrl = config.get('DATABASE_URL');
                    if (!databaseUrl) {
                        const pwd = config.get('DB_PASSWORD');
                        if (typeof pwd !== 'string' || pwd.length === 0) {
                            throw new Error('DB_PASSWORD is missing or not a string. Please set DB_PASSWORD in your .env (or use DATABASE_URL).');
                        }
                    }
                    const common = {
                        type: 'postgres',
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: config.get('DB_SYNCHRONIZE', false),
                        logging: config.get('DB_LOGGING', true),
                    };
                    if (databaseUrl) {
                        return { ...common, url: String(databaseUrl) };
                    }
                    return {
                        ...common,
                        host: String(config.get('DB_HOST')),
                        port: Number(config.get('DB_PORT') ?? 5432),
                        username: String(config.get('DB_USERNAME')),
                        password: String(config.get('DB_PASSWORD')),
                        database: String(config.get('DB_DATABASE')),
                    };
                },
            }),
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
            applicant_module_1.ApplicantModule,
            nonprofit_module_1.NonprofitModule,
            jobs_module_1.JobsModule,
            education_module_1.EducationModule,
            experience_module_1.ExperienceModule,
            certification_module_1.CertificationModule,
            upload_module_1.UploadModule,
            admin_module_1.AdminModule,
            messaging_module_1.MessagingModule,
            notifications_module_1.NotificationsModule,
            ai_module_1.AiModule,
            sms_module_1.SmsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map