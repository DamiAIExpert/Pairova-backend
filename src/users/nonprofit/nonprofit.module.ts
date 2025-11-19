// src/users/nonprofit/nonprofit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NonprofitController } from './nonprofit.controller';
import { NonprofitService } from './nonprofit.service';
import { NonprofitOrg } from './nonprofit.entity';
import { NgoJobsController } from './ngo-jobs.controller';
import { NgoApplicationsController } from './ngo-applications.controller';
import { JobsModule } from '../../jobs/jobs.module';
import { ApplicantModule } from '../applicant/applicant.module';
import { ExperienceModule } from '../../profiles/experience/experience.module';
import { EducationModule } from '../../profiles/education/education.module';
import { CertificationModule } from '../../profiles/certifications/certification.module';
import { UploadModule } from '../../profiles/uploads/upload.module';

/**
 * @class NonprofitModule
 * @description Encapsulates all logic related to non-profit organization profiles.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NonprofitOrg]),
    JobsModule,
    ApplicantModule,
    ExperienceModule,
    EducationModule,
    CertificationModule,
    UploadModule,
  ],
  controllers: [NonprofitController, NgoJobsController, NgoApplicationsController],
  providers: [NonprofitService],
  exports: [NonprofitService],
})
export class NonprofitModule {}
