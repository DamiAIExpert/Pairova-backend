"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../shared/user.entity");
const application_service_1 = require("../../jobs/job-application/application.service");
const applicant_service_1 = require("../applicant/applicant.service");
const experience_service_1 = require("../../profiles/experience/experience.service");
const education_service_1 = require("../../profiles/education/education.service");
const certification_service_1 = require("../../profiles/certifications/certification.service");
const upload_service_1 = require("../../profiles/uploads/upload.service");
let NgoApplicationsController = class NgoApplicationsController {
    applicationsService;
    applicantService;
    experienceService;
    educationService;
    certificationService;
    uploadService;
    constructor(applicationsService, applicantService, experienceService, educationService, certificationService, uploadService) {
        this.applicationsService = applicationsService;
        this.applicantService = applicantService;
        this.experienceService = experienceService;
        this.educationService = educationService;
        this.certificationService = certificationService;
        this.uploadService = uploadService;
    }
    async getMyApplications(user, status, jobId, pageParam, limitParam) {
        const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;
        const limit = limitParam ? parseInt(limitParam, 10) || 20 : 20;
        return this.applicationsService.getApplicationsByOrganization(user, { status, jobId }, page, limit);
    }
    async getApplication(user, id) {
        return this.applicationsService.getApplicationByOrganization(id, user);
    }
    async updateApplicationStatus(user, id, updateData) {
        return this.applicationsService.updateApplicationStatusByOrganization(id, user, updateData);
    }
    async getApplicationStatistics(user) {
        return this.applicationsService.getApplicationStatistics(user);
    }
    async getApplicationPipeline(user) {
        const stats = await this.applicationsService.getApplicationStatistics(user);
        const total = stats.totalApplications || 1;
        return {
            stages: [
                {
                    stage: 'Pending',
                    count: stats.pendingApplications,
                    percentage: Math.round((stats.pendingApplications / total) * 100),
                },
                {
                    stage: 'Reviewed',
                    count: stats.reviewedApplications,
                    percentage: Math.round((stats.reviewedApplications / total) * 100),
                },
                {
                    stage: 'Shortlisted',
                    count: stats.shortlistedApplications,
                    percentage: Math.round((stats.shortlistedApplications / total) * 100),
                },
                {
                    stage: 'Interviewed',
                    count: stats.interviewedApplications,
                    percentage: Math.round((stats.interviewedApplications / total) * 100),
                },
                {
                    stage: 'Accepted',
                    count: stats.acceptedApplications,
                    percentage: Math.round((stats.acceptedApplications / total) * 100),
                },
            ],
        };
    }
    async bulkUpdateApplicationStatus(user, updateData) {
        return this.applicationsService.bulkUpdateApplicationStatusByOrganization(user, updateData.applicationIds, updateData.status, updateData.notes);
    }
    async getApplicantProfile(user, applicantId) {
        const applications = await this.applicationsService.getApplicationsByOrganization(user, {}, 1, 1000);
        const application = applications.applications.find((app) => app.applicantId === applicantId);
        if (!application) {
            throw new common_1.ForbiddenException('You are not authorized to view this applicant profile. No application found from this applicant.');
        }
        if (!application.applicant?.applicantProfile) {
            throw new common_1.NotFoundException('Applicant profile not found');
        }
        const profile = application.applicant.applicantProfile;
        const [experiences, educations, certifications, attachments] = await Promise.all([
            this.experienceService.findByUserId(applicantId).catch(() => []),
            this.educationService.findByUserId(applicantId).catch(() => []),
            this.certificationService.findAllByUserId(applicantId).catch(() => []),
            this.uploadService.listUserUploads(applicantId, 'attachment').catch(() => []),
        ]);
        return {
            profile,
            experiences,
            educations,
            certifications,
            attachments,
        };
    }
};
exports.NgoApplicationsController = NgoApplicationsController;
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications to jobs posted by the current NGO' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Applications retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by application status' }),
    (0, swagger_1.ApiQuery)({ name: 'jobId', required: false, type: String, description: 'Filter by specific job ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('jobId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific application details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Application is for another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "getApplication", null);
__decorate([
    (0, common_1.Put)('applications/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Application is for another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "updateApplicationStatus", null);
__decorate([
    (0, common_1.Get)('applications/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application statistics for the current NGO' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "getApplicationStatistics", null);
__decorate([
    (0, common_1.Get)('applications/pipeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application pipeline overview' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pipeline data retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "getApplicationPipeline", null);
__decorate([
    (0, common_1.Put)('applications/bulk-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update application statuses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application statuses updated successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "bulkUpdateApplicationStatus", null);
__decorate([
    (0, common_1.Get)('applicants/:applicantId/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applicant profile by applicant ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Applicant profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Applicant not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - No application from this applicant' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('applicantId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], NgoApplicationsController.prototype, "getApplicantProfile", null);
exports.NgoApplicationsController = NgoApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('NGO - Application Management'),
    (0, common_1.Controller)('ngos/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [application_service_1.ApplicationsService,
        applicant_service_1.ApplicantService,
        experience_service_1.ExperienceService,
        education_service_1.EducationService,
        certification_service_1.CertificationService,
        upload_service_1.UploadService])
], NgoApplicationsController);
//# sourceMappingURL=ngo-applications.controller.js.map