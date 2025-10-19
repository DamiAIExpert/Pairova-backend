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
exports.SavedJobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const saved_jobs_service_1 = require("./saved-jobs.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
let SavedJobsController = class SavedJobsController {
    savedJobsService;
    constructor(savedJobsService) {
        this.savedJobsService = savedJobsService;
    }
    async getSavedJobs(user, page = 1, limit = 20) {
        return this.savedJobsService.getSavedJobs(user.id, page, limit);
    }
    async saveJob(user, jobId) {
        return this.savedJobsService.saveJob(user.id, jobId);
    }
    async unsaveJob(user, jobId) {
        await this.savedJobsService.unsaveJob(user.id, jobId);
        return { message: 'Job unsaved successfully' };
    }
    async isJobSaved(user, jobId) {
        const isSaved = await this.savedJobsService.isJobSaved(user.id, jobId);
        return { isSaved };
    }
};
exports.SavedJobsController = SavedJobsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get saved jobs for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Saved jobs retrieved successfully.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], SavedJobsController.prototype, "getSavedJobs", null);
__decorate([
    (0, common_1.Post)(':jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Save a job' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Job saved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Job already saved.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SavedJobsController.prototype, "saveJob", null);
__decorate([
    (0, common_1.Delete)(':jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Unsave a job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job unsaved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Saved job not found.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SavedJobsController.prototype, "unsaveJob", null);
__decorate([
    (0, common_1.Get)(':jobId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if job is saved' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status retrieved successfully.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SavedJobsController.prototype, "isJobSaved", null);
exports.SavedJobsController = SavedJobsController = __decorate([
    (0, swagger_1.ApiTags)('Saved Jobs'),
    (0, common_1.Controller)('saved-jobs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [saved_jobs_service_1.SavedJobsService])
], SavedJobsController);
//# sourceMappingURL=saved-jobs.controller.js.map