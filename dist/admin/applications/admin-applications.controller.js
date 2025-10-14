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
exports.AdminApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_applications_service_1 = require("./admin-applications.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const admin_application_dto_1 = require("./dto/admin-application.dto");
let AdminApplicationsController = class AdminApplicationsController {
    adminApplicationsService;
    constructor(adminApplicationsService) {
        this.adminApplicationsService = adminApplicationsService;
    }
    findAll(paginationDto, status, jobId, applicantId, ngoId, search) {
        return this.adminApplicationsService.findAll(paginationDto, { status, jobId, applicantId, ngoId, search });
    }
    findOne(id) {
        return this.adminApplicationsService.findOne(id);
    }
    updateStatus(id, updateApplicationStatusDto) {
        return this.adminApplicationsService.updateStatus(id, updateApplicationStatusDto);
    }
    getPipeline(ngoId) {
        return this.adminApplicationsService.getPipeline(ngoId);
    }
    getStatistics(ngoId) {
        return this.adminApplicationsService.getStatistics(ngoId);
    }
};
exports.AdminApplicationsController = AdminApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of all applications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of applications retrieved successfully.', type: admin_application_dto_1.AdminApplicationListDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('jobId')),
    __param(3, (0, common_1.Query)('applicantId')),
    __param(4, (0, common_1.Query)('ngoId')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application details retrieved successfully.', type: admin_application_dto_1.AdminApplicationDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application status updated successfully.', type: admin_application_dto_1.AdminApplicationDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_application_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", void 0)
], AdminApplicationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('pipeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application pipeline overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pipeline overview retrieved successfully.', type: admin_application_dto_1.ApplicationPipelineDto }),
    __param(0, (0, common_1.Query)('ngoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminApplicationsController.prototype, "getPipeline", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application statistics retrieved successfully.' }),
    __param(0, (0, common_1.Query)('ngoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminApplicationsController.prototype, "getStatistics", null);
exports.AdminApplicationsController = AdminApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Applications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin/applications'),
    __metadata("design:paramtypes", [admin_applications_service_1.AdminApplicationsService])
], AdminApplicationsController);
//# sourceMappingURL=admin-applications.controller.js.map