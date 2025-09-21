// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule as UserModule } from './users/shared/user.module';
import { ApplicantModule } from './users/applicant/applicant.module';
import { NonprofitModule } from './users/nonprofit/nonprofit.module';
import { JobsModule } from './jobs/jobs.module';
import { EducationModule } from './profiles/education/education.module';
import { ExperienceModule } from './profiles/experience/experience.module';
import { CertificationModule } from './profiles/certifications/certification.module';
import { UploadModule } from './profiles/uploads/upload.module';
import { AdminModule } from './admin/admin.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        // Allow DATABASE_URL OR discrete credentials
        DATABASE_URL: Joi.string().uri().optional(),
        DB_HOST: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
        DB_PORT: Joi.alternatives(Joi.string(), Joi.number()).default(5432),
        DB_USERNAME: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
        DB_PASSWORD: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
        DB_DATABASE: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
        DB_SYNCHRONIZE: Joi.boolean().default(false),
        DB_LOGGING: Joi.boolean().default(true),
        // other app envs...
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        // If using discrete credentials, assert password is a string
        if (!databaseUrl) {
          const pwd = config.get<string>('DB_PASSWORD');
          if (typeof pwd !== 'string' || pwd.length === 0) {
            throw new Error(
              'DB_PASSWORD is missing or not a string. Please set DB_PASSWORD in your .env (or use DATABASE_URL).',
            );
          }
        }

        // Shared options
        const common = {
          type: 'postgres' as const,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
          logging: config.get<boolean>('DB_LOGGING', true),
          // If you need SSL in production:
          // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        };

        // Prefer DATABASE_URL if present
        if (databaseUrl) {
          return { ...common, url: String(databaseUrl) };
        }

        // Otherwise use discrete fields, casting to the right types
        return {
          ...common,
          host: String(config.get('DB_HOST')),
          port: Number(config.get('DB_PORT') ?? 5432),
          username: String(config.get('DB_USERNAME')),
          password: String(config.get('DB_PASSWORD')), // ensure string
          database: String(config.get('DB_DATABASE')),
        };
      },
    }),

    // Feature modules
    AuthModule,
    UserModule,
    ApplicantModule,
    NonprofitModule,
    JobsModule,
    EducationModule,
    ExperienceModule,
    CertificationModule,
    UploadModule,
    AdminModule,
    MessagingModule,
    NotificationsModule,
    AiModule,
    SmsModule,
  ],
})
export class AppModule {}
