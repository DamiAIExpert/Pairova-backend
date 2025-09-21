// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApplicationsController } from './job-application/application.controller';
import { ApplicationsService } from './job-application/application.service';
import { JobFiltersService } from './filters/job-filters.service';
import { JobSearchController } from './job-search/job-search.controller';
import { JobSearchService } from './job-search/job-search.service';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { User } from '../users/shared/user.entity';
import { ApplicantProfile } from '../users/applicant/applicant.entity';
import { NonprofitOrg } from '../users/nonprofit/nonprofit.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/shared/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      Application,
      User,
      ApplicantProfile,
      NonprofitOrg,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [JobsController, ApplicationsController, JobSearchController],
  providers: [JobsService, ApplicationsService, JobFiltersService, JobSearchService],
  exports: [JobsService, ApplicationsService, JobSearchService],
})
export class JobsModule {}
