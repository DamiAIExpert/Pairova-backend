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
exports.AdminStorageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const storage_provider_service_1 = require("../services/storage-provider.service");
const file_storage_service_1 = require("../services/file-storage.service");
const storage_provider_factory_service_1 = require("../services/storage-provider-factory.service");
const storage_provider_dto_1 = require("../dto/storage-provider.dto");
const file_type_enum_1 = require("../../common/enums/file-type.enum");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let AdminStorageController = class AdminStorageController {
    storageProviderService;
    fileStorageService;
    storageProviderFactory;
    constructor(storageProviderService, fileStorageService, storageProviderFactory) {
        this.storageProviderService = storageProviderService;
        this.fileStorageService = fileStorageService;
        this.storageProviderFactory = storageProviderFactory;
    }
    async getStorageProviders() {
        const providers = await this.storageProviderService.getAllProviders();
        return providers.map(provider => this.mapToResponseDto(provider));
    }
    async getStorageProvider(id) {
        const provider = await this.storageProviderService.getProviderById(id);
        return this.mapToResponseDto(provider);
    }
    async createStorageProvider(createDto, user) {
        const provider = await this.storageProviderService.createProvider(createDto, user.id);
        return this.mapToResponseDto(provider);
    }
    async updateStorageProvider(id, updateDto, user) {
        const provider = await this.storageProviderService.updateProvider(id, updateDto, user.id);
        return this.mapToResponseDto(provider);
    }
    async deleteStorageProvider(id) {
        await this.storageProviderService.deleteProvider(id);
    }
    async testStorageProvider(id) {
        const provider = await this.storageProviderService.getProviderById(id);
        const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
        const startTime = Date.now();
        const healthStatus = await storageService.healthCheck();
        const responseTime = Date.now() - startTime;
        await this.storageProviderService.updateProviderHealth(id, healthStatus.isHealthy, healthStatus.error);
        return {
            id: provider.id,
            name: provider.name,
            type: provider.type,
            isHealthy: healthStatus.isHealthy,
            responseTime,
            error: healthStatus.error,
            checkedAt: new Date(),
            status: healthStatus.status,
        };
    }
    async performHealthCheck(id) {
        await this.fileStorageService.performHealthCheck(id);
    }
    async performHealthCheckAll() {
        await this.fileStorageService.performHealthCheck();
    }
    async getStorageUsage() {
        return await this.fileStorageService.getStorageUsage();
    }
    async getSupportedStorageTypes() {
        const types = this.storageProviderFactory.getSupportedTypes();
        return types.map(type => ({
            type,
            description: this.storageProviderFactory.getTypeDescription(type),
        }));
    }
    async getFiles(paginationDto, fileType, userId) {
        return {
            message: 'Files retrieved successfully',
            pagination: paginationDto,
            filters: { fileType, userId },
        };
    }
    async testUpload(file, uploadDto, user) {
        const fileType = uploadDto.fileType ? file_type_enum_1.FileType[uploadDto.fileType.toUpperCase()] : file_type_enum_1.FileType.OTHER;
        const uploadedFile = await this.fileStorageService.uploadFile(file, user.id, fileType, {
            folder: uploadDto.folder,
            isPublic: uploadDto.isPublic,
            metadata: uploadDto.metadata,
        });
        return {
            id: uploadedFile.id,
            url: uploadedFile.url,
            thumbnailUrl: uploadedFile.thumbnailUrl,
            size: uploadedFile.size,
            mimeType: uploadedFile.mimeType,
            fileType: uploadedFile.fileType,
            storageProvider: uploadedFile.storageProvider.name,
            uploadedAt: uploadedFile.createdAt,
        };
    }
    async activateProvider(id) {
        const provider = await this.storageProviderService.activateProvider(id);
        return this.mapToResponseDto(provider);
    }
    async deactivateProvider(id) {
        const provider = await this.storageProviderService.deactivateProvider(id);
        return this.mapToResponseDto(provider);
    }
    async updateProviderPriority(id, priority) {
        const provider = await this.storageProviderService.updateProviderPriority(id, priority);
        return this.mapToResponseDto(provider);
    }
    mapToResponseDto(provider) {
        return {
            id: provider.id,
            name: provider.name,
            type: provider.type,
            isActive: provider.isActive,
            priority: provider.priority,
            description: provider.description,
            usageCount: provider.usageCount,
            totalStorageUsed: provider.totalStorageUsed,
            isHealthy: provider.isHealthy,
            lastHealthCheck: provider.lastHealthCheck,
            healthCheckError: provider.healthCheckError,
            createdAt: provider.createdAt,
            updatedAt: provider.updatedAt,
            metadata: provider.metadata,
        };
    }
};
exports.AdminStorageController = AdminStorageController;
__decorate([
    (0, common_1.Get)('providers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all storage providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage providers retrieved successfully', type: [storage_provider_dto_1.StorageProviderResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "getStorageProviders", null);
__decorate([
    (0, common_1.Get)('providers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage provider by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage provider retrieved successfully', type: storage_provider_dto_1.StorageProviderResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage provider not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "getStorageProvider", null);
__decorate([
    (0, common_1.Post)('providers'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Storage provider created successfully', type: storage_provider_dto_1.StorageProviderResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [storage_provider_dto_1.CreateStorageProviderDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "createStorageProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage provider updated successfully', type: storage_provider_dto_1.StorageProviderResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage provider not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, storage_provider_dto_1.UpdateStorageProviderDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "updateStorageProvider", null);
__decorate([
    (0, common_1.Delete)('providers/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Storage provider deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage provider not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "deleteStorageProvider", null);
__decorate([
    (0, common_1.Post)('providers/:id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test storage provider connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection test completed', type: storage_provider_dto_1.StorageProviderHealthDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "testStorageProvider", null);
__decorate([
    (0, common_1.Post)('providers/:id/health-check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Perform health check on storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health check completed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "performHealthCheck", null);
__decorate([
    (0, common_1.Post)('providers/health-check-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Perform health check on all storage providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health checks completed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "performHealthCheckAll", null);
__decorate([
    (0, common_1.Get)('usage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage usage statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage usage retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "getStorageUsage", null);
__decorate([
    (0, common_1.Get)('supported-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supported storage types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supported storage types retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "getSupportedStorageTypes", null);
__decorate([
    (0, common_1.Get)('files'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all uploaded files with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Files retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('fileType')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "getFiles", null);
__decorate([
    (0, common_1.Post)('upload/test'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Test file upload with current storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded successfully', type: storage_provider_dto_1.FileUploadResponseDto }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, storage_provider_dto_1.FileUploadDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "testUpload", null);
__decorate([
    (0, common_1.Put)('providers/:id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage provider activated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "activateProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate storage provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage provider deactivated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "deactivateProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id/priority'),
    (0, swagger_1.ApiOperation)({ summary: 'Update storage provider priority' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage provider priority updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminStorageController.prototype, "updateProviderPriority", null);
exports.AdminStorageController = AdminStorageController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin/storage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [storage_provider_service_1.StorageProviderService,
        file_storage_service_1.FileStorageService,
        storage_provider_factory_service_1.StorageProviderFactoryService])
], AdminStorageController);
//# sourceMappingURL=admin-storage.controller.js.map