// src/users/applicant/applicant.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { ApplicantProfile } from './applicant.entity';
import { ApplicantJobsController } from './applicant-jobs.controller';
import { JobsModule } from '../../jobs/jobs.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { User } from '../shared/user.entity';

/**
 * @class ApplicantModule
 * @description Encapsulates all logic related to applicant profiles.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicantProfile, User]),
    forwardRef(() => JobsModule),
    NotificationsModule,
  ],
  controllers: [ApplicantController, ApplicantJobsController],
  providers: [ApplicantService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
