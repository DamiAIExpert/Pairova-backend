// src/jobs/jobs.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApplicationsController } from './job-application/application.controller';
import { ApplicationsService } from './job-application/application.service';
import { JobFiltersService } from './filters/job-filters.service';
import { JobSearchController } from './job-search/job-search.controller';
import { JobSearchService } from './job-search/job-search.service';
import { SavedJobsController } from './saved-jobs/saved-jobs.controller';
import { SavedJobsService } from './saved-jobs/saved-jobs.service';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { SavedJob } from './entities/saved-job.entity';
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
      SavedJob,
      User,
      ApplicantProfile,
      NonprofitOrg,
    ]),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  controllers: [JobsController, ApplicationsController, JobSearchController, SavedJobsController],
  providers: [JobsService, ApplicationsService, JobFiltersService, JobSearchService, SavedJobsService],
  exports: [JobsService, ApplicationsService, JobSearchService, SavedJobsService],
})
export class JobsModule {}
