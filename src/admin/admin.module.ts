// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LogsController } from './audit/logs.controller';
import { LogsService } from './audit/logs.service';
import { PagesController } from './pages/pages.controller';
import { PagesService } from './pages/pages.service';
import { AuditLog } from './audit/entities/audit-log.entity';
import { Page } from './pages/entities/page.entity';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';

// Note: Landing, Settings, and Terms have been omitted for brevity
// but would follow the same structure as Pages and Audit.

/**
 * @class AdminModule
 * @description The main module for all administrative functionalities, including CMS, audit logs, and dashboard data.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, Page, User, Job, Application])],
  controllers: [AdminController, LogsController, PagesController],
  providers: [AdminService, LogsService, PagesService],
  exports: [AdminService, LogsService],
})
export class AdminModule {}
