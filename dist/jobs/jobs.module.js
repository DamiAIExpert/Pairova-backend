"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jobs_controller_1 = require("./jobs.controller");
const jobs_service_1 = require("./jobs.service");
const application_controller_1 = require("./job-application/application.controller");
const application_service_1 = require("./job-application/application.service");
const job_filters_service_1 = require("./filters/job-filters.service");
const job_search_controller_1 = require("./job-search/job-search.controller");
const job_search_service_1 = require("./job-search/job-search.service");
const job_entity_1 = require("./entities/job.entity");
const application_entity_1 = require("./entities/application.entity");
const user_entity_1 = require("../users/shared/user.entity");
const applicant_entity_1 = require("../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../users/nonprofit/nonprofit.entity");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../users/shared/user.module");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                job_entity_1.Job,
                application_entity_1.Application,
                user_entity_1.User,
                applicant_entity_1.ApplicantProfile,
                nonprofit_entity_1.NonprofitOrg,
            ]),
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
        ],
        controllers: [jobs_controller_1.JobsController, application_controller_1.ApplicationsController, job_search_controller_1.JobSearchController],
        providers: [jobs_service_1.JobsService, application_service_1.ApplicationsService, job_filters_service_1.JobFiltersService, job_search_service_1.JobSearchService],
        exports: [jobs_service_1.JobsService, application_service_1.ApplicationsService, job_search_service_1.JobSearchService],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map