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
exports.NgoJobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../shared/user.entity");
const jobs_service_1 = require("../../jobs/jobs.service");
const create_job_dto_1 = require("../../jobs/dto/create-job.dto");
let NgoJobsController = class NgoJobsController {
    jobsService;
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async getMyJobs(user, status, page = 1, limit = 20) {
        return { jobs: [], total: 0, page, limit };
    }
    async createJob(user, createJobDto) {
        return await this.jobsService.create(createJobDto, user);
    }
    async getJob(user, id) {
        return { message: 'Job details will be implemented' };
    }
    async updateJob(user, id, updateJobDto) {
        return { message: 'Job update will be implemented' };
    }
    async deleteJob(user, id) {
        return { message: 'Job deleted successfully' };
    }
    async getJobApplicants(user, jobId, status, page = 1, limit = 20) {
        return { applicants: [], total: 0, page, limit };
    }
    async updateApplicationStatus(user, jobId, applicantId, status, notes) {
        return { message: 'Application status updated successfully' };
    }
    async getJobStatistics(user) {
        return {
            totalJobs: 0,
            activeJobs: 0,
            totalApplications: 0,
            pendingApplications: 0,
            hiredCount: 0,
            rejectedCount: 0,
        };
    }
    async getDashboard(user) {
        return {
            recentJobs: [],
            recentApplications: [],
            statistics: {},
            notifications: [],
        };
    }
};
exports.NgoJobsController = NgoJobsController;
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all jobs posted by the current NGO' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Jobs retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by job status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "getMyJobs", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new job posting' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Job created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "createJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job details by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Job belongs to another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "getJob", null);
__decorate([
    (0, common_1.Put)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a job posting' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Job belongs to another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a job posting' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Job belongs to another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "deleteJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id/applicants'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applicants for a specific job' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Applicants retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Job belongs to another organization' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by application status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "getJobApplicants", null);
__decorate([
    (0, common_1.Put)('jobs/:jobId/applicants/:applicantId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job or application not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized - Job belongs to another organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('applicantId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)('status')),
    __param(4, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "updateApplicationStatus", null);
__decorate([
    (0, common_1.Get)('jobs/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job statistics for the current NGO' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "getJobStatistics", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NGO dashboard data' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard data retrieved successfully',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NgoJobsController.prototype, "getDashboard", null);
exports.NgoJobsController = NgoJobsController = __decorate([
    (0, swagger_1.ApiTags)('NGO - Job Management'),
    (0, common_1.Controller)('ngos/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], NgoJobsController);
//# sourceMappingURL=ngo-jobs.controller.js.map