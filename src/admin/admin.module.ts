// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LogsController } from './audit/logs.controller';
import { LogsService } from './audit/logs.service';
import { PagesController } from './pages/pages.controller';
import { PagesService } from './pages/pages.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { LandingController } from './landing-page/landing.controller';
import { LandingService } from './landing-page/landing.service';
import { TermsController } from './terms/terms.controller';
import { TermsService } from './terms/terms.service';

// New admin management controllers and services
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';
import { AdminJobSeekersController } from './job-seekers/admin-job-seekers.controller';
import { AdminJobSeekersService } from './job-seekers/admin-job-seekers.service';
import { AdminNgosController } from './ngos/admin-ngos.controller';
import { AdminNgosService } from './ngos/admin-ngos.service';
import { AdminFeedbackController, PublicFeedbackController } from './feedback/admin-feedback.controller';
import { AdminFeedbackService } from './feedback/admin-feedback.service';
import { AdminApplicationsController } from './applications/admin-applications.controller';
import { AdminApplicationsService } from './applications/admin-applications.service';

// Entities
import { AuditLog } from './audit/entities/audit-log.entity';
import { Page } from './pages/entities/page.entity';
import { Feedback } from './feedback/entities/feedback.entity';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { ApplicantProfile } from '../users/applicant/applicant.entity';
import { NonprofitOrg } from '../users/nonprofit/nonprofit.entity';
import { Education } from '../profiles/education/entities/education.entity';
import { Experience } from '../profiles/experience/entities/experience.entity';
import { Certification } from '../profiles/certifications/entities/certification.entity';

/**
 * @class AdminModule
 * @description The main module for all administrative functionalities, including CMS, audit logs, dashboard data, and user management.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLog,
      Page,
      Feedback,
      User,
      Job,
      Application,
      ApplicantProfile,
      NonprofitOrg,
      Education,
      Experience,
      Certification,
    ]),
  ],
  controllers: [
    // Core admin controllers
    AdminController,
    LogsController,
    PagesController,
    SettingsController,
    LandingController,
    TermsController,
    
    // User management controllers
    AdminUsersController,
    AdminJobSeekersController,
    AdminNgosController,
    AdminApplicationsController,
    
    // Feedback controllers
    AdminFeedbackController,
    PublicFeedbackController,
  ],
  providers: [
    // Core admin services
    AdminService,
    LogsService,
    PagesService,
    SettingsService,
    LandingService,
    TermsService,
    
    // User management services
    AdminUsersService,
    AdminJobSeekersService,
    AdminNgosService,
    AdminApplicationsService,
    
    // Feedback service
    AdminFeedbackService,
  ],
  exports: [
    AdminService,
    LogsService,
    AdminUsersService,
    AdminJobSeekersService,
    AdminNgosService,
    AdminApplicationsService,
    AdminFeedbackService,
  ],
})
export class AdminModule {}
