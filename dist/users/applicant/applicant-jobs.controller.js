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
exports.ApplicantJobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../shared/user.entity");
const jobs_service_1 = require("../../jobs/jobs.service");
const job_search_service_1 = require("../../jobs/job-search/job-search.service");
const application_service_1 = require("../../jobs/job-application/application.service");
const create_application_dto_1 = require("../../jobs/dto/create-application.dto");
const notification_service_1 = require("../../notifications/notification.service");
const job_enum_1 = require("../../common/enums/job.enum");
let ApplicantJobsController = class ApplicantJobsController {
    jobsService;
    jobSearchService;
    applicationsService;
    notificationService;
    constructor(jobsService, jobSearchService, applicationsService, notificationService) {
        this.jobsService = jobsService;
        this.jobSearchService = jobSearchService;
        this.applicationsService = applicationsService;
        this.notificationService = notificationService;
    }
    async searchJobs(user, searchParams) {
        return this.jobSearchService.searchJobsForApplicant(user, searchParams);
    }
    async getRecommendedJobs(user, limit = 10) {
        return this.jobSearchService.getRecommendedJobsForApplicant(user, limit);
    }
    async getSavedJobs(user, page = 1, limit = 20) {
        return this.jobSearchService.getSavedJobsForApplicant(user, page, limit);
    }
    async saveJob(user, jobId) {
        await this.jobSearchService.saveJobForApplicant(user, jobId);
        return { message: 'Job saved successfully' };
    }
    async unsaveJob(user, jobId) {
        await this.jobSearchService.unsaveJobForApplicant(user, jobId);
        return { message: 'Job unsaved successfully' };
    }
    async applyForJob(user, jobId, applicationData) {
        const application = await this.applicationsService.apply({ ...applicationData, jobId }, user);
        return { message: 'Application submitted successfully', applicationId: application.id };
    }
    async getMyApplications(user, status, page = 1, limit = 20) {
        const applications = await this.applicationsService.findAllForUser(user);
        const filteredApplications = status
            ? applications.filter(app => app.status === status)
            : applications;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
        return {
            applications: paginatedApplications,
            total: filteredApplications.length,
            page,
            limit,
        };
    }
    async getApplication(user, id) {
        return this.applicationsService.findOne(id, user);
    }
    async withdrawApplication(user, id) {
        const application = await this.applicationsService.findOne(id, user);
        if (application.status === job_enum_1.ApplicationStatus.ACCEPTED) {
            throw new common_1.ForbiddenException('Cannot withdraw an accepted application');
        }
        await this.applicationsService.remove(id);
        return { message: 'Application withdrawn successfully' };
    }
    async getDashboard(user) {
        const [applications, savedJobs, recommendedJobs, notifications] = await Promise.all([
            this.applicationsService.findAllForUser(user),
            this.jobSearchService.getSavedJobsForApplicant(user, 1, 5),
            this.jobSearchService.getRecommendedJobsForApplicant(user, 5),
            this.notificationService.getUserNotifications(user.id, 1, 10),
        ]);
        const statistics = {
            totalApplications: applications.length,
            pendingApplications: applications.filter(app => app.status === job_enum_1.ApplicationStatus.PENDING).length,
            acceptedApplications: applications.filter(app => app.status === job_enum_1.ApplicationStatus.ACCEPTED).length,
            rejectedApplications: applications.filter(app => app.status === job_enum_1.ApplicationStatus.REJECTED).length,
            savedJobsCount: savedJobs.total,
        };
        return {
            recentApplications: applications.slice(0, 5),
            savedJobs: savedJobs.jobs,
            recommendedJobs: recommendedJobs.jobs,
            statistics,
            notifications: notifications.notifications,
        };
    }
    async getApplicationStatistics(user) {
        const applications = await this.applicationsService.findAllForUser(user);
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const applicationsThisMonth = applications.filter(app => new Date(app.createdAt) >= thisMonth).length;
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(app => app.status === job_enum_1.ApplicationStatus.PENDING).length;
        const acceptedApplications = applications.filter(app => app.status === job_enum_1.ApplicationStatus.ACCEPTED).length;
        const rejectedApplications = applications.filter(app => app.status === job_enum_1.ApplicationStatus.REJECTED).length;
        const successRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0;
        const averageResponseTime = 0;
        return {
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            applicationsThisMonth,
            averageResponseTime,
            successRate,
        };
    }
};
exports.ApplicantJobsController = ApplicantJobsController;
__decorate([
    (0, common_1.Get)('jobs/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for jobs with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job search results retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false, type: String, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, type: String, description: 'Location filter' }),
    (0, swagger_1.ApiQuery)({ name: 'employmentType', required: false, type: String, description: 'Employment type filter' }),
    (0, swagger_1.ApiQuery)({ name: 'experienceLevel', required: false, type: String, description: 'Experience level filter' }),
    (0, swagger_1.ApiQuery)({ name: 'salaryMin', required: false, type: Number, description: 'Minimum salary filter' }),
    (0, swagger_1.ApiQuery)({ name: 'salaryMax', required: false, type: Number, description: 'Maximum salary filter' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "searchJobs", null);
__decorate([
    (0, common_1.Get)('jobs/recommended'),
    (0, swagger_1.ApiOperation)({ summary: 'Get personalized job recommendations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recommended jobs retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of recommendations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getRecommendedJobs", null);
__decorate([
    (0, common_1.Get)('jobs/saved'),
    (0, swagger_1.ApiOperation)({ summary: 'Get saved jobs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Saved jobs retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getSavedJobs", null);
__decorate([
    (0, common_1.Post)('jobs/:jobId/save'),
    (0, swagger_1.ApiOperation)({ summary: 'Save a job' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Job saved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Job already saved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "saveJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:jobId/save'),
    (0, swagger_1.ApiOperation)({ summary: 'Unsave a job' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job unsaved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found or not saved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "unsaveJob", null);
__decorate([
    (0, common_1.Post)('jobs/:jobId/apply'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for a job' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Application submitted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already applied for this job' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "applyForJob", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my job applications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Applications retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by application status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific application details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Application belongs to another user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getApplication", null);
__decorate([
    (0, common_1.Delete)('applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw an application' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application withdrawn successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Application belongs to another user' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot withdraw application - Status not allowed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "withdrawApplication", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker dashboard data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard data retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('applications/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicantJobsController.prototype, "getApplicationStatistics", null);
exports.ApplicantJobsController = ApplicantJobsController = __decorate([
    (0, swagger_1.ApiTags)('Job Seeker - Job Search & Applications'),
    (0, common_1.Controller)('applicants/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.APPLICANT),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        job_search_service_1.JobSearchService,
        application_service_1.ApplicationsService,
        notification_service_1.NotificationService])
], ApplicantJobsController);
//# sourceMappingURL=applicant-jobs.controller.js.map