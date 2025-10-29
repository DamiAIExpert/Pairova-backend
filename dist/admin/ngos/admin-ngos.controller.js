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
exports.AdminNgosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_ngos_service_1 = require("./admin-ngos.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const admin_ngo_dto_1 = require("./dto/admin-ngo.dto");
const update_ngo_dto_1 = require("./dto/update-ngo.dto");
let AdminNgosController = class AdminNgosController {
    adminNgosService;
    constructor(adminNgosService) {
        this.adminNgosService = adminNgosService;
    }
    findAll(paginationDto, search) {
        return this.adminNgosService.findAll(paginationDto, { search });
    }
    findOne(id) {
        return this.adminNgosService.findOne(id);
    }
    update(id, updateNgoDto) {
        return this.adminNgosService.update(id, updateNgoDto);
    }
    remove(id) {
        return this.adminNgosService.remove(id);
    }
    getJobs(id, paginationDto) {
        return this.adminNgosService.getJobs(id, paginationDto);
    }
    getJobApplicants(ngoId, jobId, paginationDto) {
        return this.adminNgosService.getJobApplicants(ngoId, jobId, paginationDto);
    }
    getStatistics(id) {
        return this.adminNgosService.getStatistics(id);
    }
};
exports.AdminNgosController = AdminNgosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of all NGOs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of NGOs retrieved successfully.', type: admin_ngo_dto_1.AdminNgoListDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NGO details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NGO details retrieved successfully.', type: admin_ngo_dto_1.AdminNgoDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'NGO not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update NGO profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NGO updated successfully.', type: admin_ngo_dto_1.AdminNgoDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'NGO not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ngo_dto_1.UpdateNgoDto]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete or suspend NGO account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NGO deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'NGO not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NGO posted jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NGO jobs retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)(':id/jobs/:jobId/applicants'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job applicants for NGO job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job applicants retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "getJobApplicants", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NGO statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NGO statistics retrieved successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminNgosController.prototype, "getStatistics", null);
exports.AdminNgosController = AdminNgosController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin/ngos'),
    __metadata("design:paramtypes", [admin_ngos_service_1.AdminNgosService])
], AdminNgosController);
//# sourceMappingURL=admin-ngos.controller.js.map