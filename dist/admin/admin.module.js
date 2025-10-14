"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const logs_controller_1 = require("./audit/logs.controller");
const logs_service_1 = require("./audit/logs.service");
const pages_controller_1 = require("./pages/pages.controller");
const pages_service_1 = require("./pages/pages.service");
const settings_controller_1 = require("./settings/settings.controller");
const settings_service_1 = require("./settings/settings.service");
const landing_controller_1 = require("./landing-page/landing.controller");
const landing_service_1 = require("./landing-page/landing.service");
const terms_controller_1 = require("./terms/terms.controller");
const terms_service_1 = require("./terms/terms.service");
const admin_users_controller_1 = require("./users/admin-users.controller");
const admin_users_service_1 = require("./users/admin-users.service");
const admin_job_seekers_controller_1 = require("./job-seekers/admin-job-seekers.controller");
const admin_job_seekers_service_1 = require("./job-seekers/admin-job-seekers.service");
const admin_ngos_controller_1 = require("./ngos/admin-ngos.controller");
const admin_ngos_service_1 = require("./ngos/admin-ngos.service");
const admin_feedback_controller_1 = require("./feedback/admin-feedback.controller");
const admin_feedback_service_1 = require("./feedback/admin-feedback.service");
const admin_applications_controller_1 = require("./applications/admin-applications.controller");
const admin_applications_service_1 = require("./applications/admin-applications.service");
const audit_log_entity_1 = require("./audit/entities/audit-log.entity");
const page_entity_1 = require("./pages/entities/page.entity");
const feedback_entity_1 = require("./feedback/entities/feedback.entity");
const user_entity_1 = require("../users/shared/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../jobs/entities/application.entity");
const applicant_entity_1 = require("../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../users/nonprofit/nonprofit.entity");
const education_entity_1 = require("../profiles/education/entities/education.entity");
const experience_entity_1 = require("../profiles/experience/entities/experience.entity");
const certification_entity_1 = require("../profiles/certifications/entities/certification.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                audit_log_entity_1.AuditLog,
                page_entity_1.Page,
                feedback_entity_1.Feedback,
                user_entity_1.User,
                job_entity_1.Job,
                application_entity_1.Application,
                applicant_entity_1.ApplicantProfile,
                nonprofit_entity_1.NonprofitOrg,
                education_entity_1.Education,
                experience_entity_1.Experience,
                certification_entity_1.Certification,
            ]),
        ],
        controllers: [
            admin_controller_1.AdminController,
            logs_controller_1.LogsController,
            pages_controller_1.PagesController,
            settings_controller_1.SettingsController,
            landing_controller_1.LandingController,
            terms_controller_1.TermsController,
            admin_users_controller_1.AdminUsersController,
            admin_job_seekers_controller_1.AdminJobSeekersController,
            admin_ngos_controller_1.AdminNgosController,
            admin_applications_controller_1.AdminApplicationsController,
            admin_feedback_controller_1.AdminFeedbackController,
            admin_feedback_controller_1.PublicFeedbackController,
        ],
        providers: [
            admin_service_1.AdminService,
            logs_service_1.LogsService,
            pages_service_1.PagesService,
            settings_service_1.SettingsService,
            landing_service_1.LandingService,
            terms_service_1.TermsService,
            admin_users_service_1.AdminUsersService,
            admin_job_seekers_service_1.AdminJobSeekersService,
            admin_ngos_service_1.AdminNgosService,
            admin_applications_service_1.AdminApplicationsService,
            admin_feedback_service_1.AdminFeedbackService,
        ],
        exports: [
            admin_service_1.AdminService,
            logs_service_1.LogsService,
            admin_users_service_1.AdminUsersService,
            admin_job_seekers_service_1.AdminJobSeekersService,
            admin_ngos_service_1.AdminNgosService,
            admin_applications_service_1.AdminApplicationsService,
            admin_feedback_service_1.AdminFeedbackService,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map