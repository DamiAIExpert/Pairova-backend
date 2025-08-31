// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApplicationsController } from './job-application/application.controller';
import { ApplicationsService } from './job-application/application.service';
import { JobFiltersService } from './filters/job-filters.service';
import { Job } from './entities/job.entity';
import { Application } from './entities/application.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/shared/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Application]),
    AuthModule,
    UsersModule,
  ],
  controllers: [JobsController, ApplicationsController],
  providers: [JobsService, ApplicationsService, JobFiltersService],
  exports: [JobsService, ApplicationsService],
})
export class JobsModule {}
