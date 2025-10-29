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
exports.AdminJobSeekersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_job_seekers_service_1 = require("./admin-job-seekers.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const admin_job_seeker_dto_1 = require("./dto/admin-job-seeker.dto");
const update_job_seeker_dto_1 = require("./dto/update-job-seeker.dto");
let AdminJobSeekersController = class AdminJobSeekersController {
    adminJobSeekersService;
    constructor(adminJobSeekersService) {
        this.adminJobSeekersService = adminJobSeekersService;
    }
    findAll(paginationDto, search) {
        return this.adminJobSeekersService.findAll(paginationDto, { search });
    }
    findOne(id) {
        return this.adminJobSeekersService.findOne(id);
    }
    update(id, updateJobSeekerDto) {
        return this.adminJobSeekersService.update(id, updateJobSeekerDto);
    }
    remove(id) {
        return this.adminJobSeekersService.remove(id);
    }
    getAppliedJobs(id, paginationDto) {
        return this.adminJobSeekersService.getAppliedJobs(id, paginationDto);
    }
    getEducation(id) {
        return this.adminJobSeekersService.getEducation(id);
    }
    getExperience(id) {
        return this.adminJobSeekersService.getExperience(id);
    }
    getCertifications(id) {
        return this.adminJobSeekersService.getCertifications(id);
    }
};
exports.AdminJobSeekersController = AdminJobSeekersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of all job seekers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of job seekers retrieved successfully.', type: admin_job_seeker_dto_1.AdminJobSeekerListDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job seeker details retrieved successfully.', type: admin_job_seeker_dto_1.AdminJobSeekerDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job seeker not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update job seeker profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job seeker updated successfully.', type: admin_job_seeker_dto_1.AdminJobSeekerDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job seeker not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_seeker_dto_1.UpdateJobSeekerDto]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete or suspend job seeker account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job seeker deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job seeker not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/applied'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker applied jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applied jobs retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "getAppliedJobs", null);
__decorate([
    (0, common_1.Get)(':id/education'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker education records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Education records retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "getEducation", null);
__decorate([
    (0, common_1.Get)(':id/experience'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker experience records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Experience records retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "getExperience", null);
__decorate([
    (0, common_1.Get)(':id/certifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker certification records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Certification records retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobSeekersController.prototype, "getCertifications", null);
exports.AdminJobSeekersController = AdminJobSeekersController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin/job-seekers'),
    __metadata("design:paramtypes", [admin_job_seekers_service_1.AdminJobSeekersService])
], AdminJobSeekersController);
//# sourceMappingURL=admin-job-seekers.controller.js.map