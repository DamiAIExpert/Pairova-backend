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
let NgoApplicationsController = class NgoApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    async getMyApplications(user, status, jobId, page = 1, limit = 20) {
        return { applications: [], total: 0, page, limit };
    }
    async getApplication(user, id) {
        return { message: 'Application details will be implemented' };
    }
    async updateApplicationStatus(user, id, updateData) {
        return { message: 'Application status updated successfully' };
    }
    async getApplicationStatistics(user) {
        return {
            totalApplications: 0,
            pendingApplications: 0,
            reviewedApplications: 0,
            acceptedApplications: 0,
            rejectedApplications: 0,
            applicationsThisMonth: 0,
            averageResponseTime: 0,
        };
    }
    async getApplicationPipeline(user) {
        return {
            stages: [],
            recentActivity: [],
            topPerformingJobs: [],
        };
    }
    async bulkUpdateApplicationStatus(user, updateData) {
        return { message: 'Application statuses updated successfully', updatedCount: 0 };
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
    __param(3, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String, Number, Number]),
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
exports.NgoApplicationsController = NgoApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('NGO - Application Management'),
    (0, common_1.Controller)('ngos/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [application_service_1.ApplicationsService])
], NgoApplicationsController);
//# sourceMappingURL=ngo-applications.controller.js.map