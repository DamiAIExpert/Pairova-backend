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
var StorageProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageProviderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const storage_provider_entity_1 = require("../entities/storage-provider.entity");
const storage_provider_factory_service_1 = require("./storage-provider-factory.service");
let StorageProviderService = StorageProviderService_1 = class StorageProviderService {
    storageProviderRepository;
    storageProviderFactory;
    logger = new common_1.Logger(StorageProviderService_1.name);
    constructor(storageProviderRepository, storageProviderFactory) {
        this.storageProviderRepository = storageProviderRepository;
        this.storageProviderFactory = storageProviderFactory;
    }
    async getAllProviders() {
        return this.storageProviderRepository.find({
            order: { priority: 'ASC', createdAt: 'DESC' },
        });
    }
    async getProviderById(id) {
        const provider = await this.storageProviderRepository.findOne({
            where: { id },
        });
        if (!provider) {
            throw new common_1.NotFoundException('Storage provider not found');
        }
        return provider;
    }
    async getActiveProviders() {
        return this.storageProviderRepository.find({
            where: { isActive: true, isHealthy: true },
            order: { priority: 'ASC' },
        });
    }
    async createProvider(createDto, userId) {
        const isValid = this.storageProviderFactory.validateConfiguration(createDto.type, createDto.configuration);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid storage provider configuration');
        }
        const existingProvider = await this.storageProviderRepository.findOne({
            where: { name: createDto.name },
        });
        if (existingProvider) {
            throw new common_1.BadRequestException('Storage provider with this name already exists');
        }
        try {
            const storageService = this.storageProviderFactory.getProvider(createDto.type, createDto.configuration);
            const healthStatus = await storageService.healthCheck();
            if (!healthStatus.isHealthy) {
                throw new common_1.BadRequestException(`Storage provider health check failed: ${healthStatus.error}`);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(`Storage provider configuration test failed: ${error.message}`);
        }
        const provider = this.storageProviderRepository.create({
            name: createDto.name,
            type: createDto.type,
            description: createDto.description,
            priority: createDto.priority,
            isActive: createDto.isActive !== undefined ? createDto.isActive : true,
            configuration: createDto.configuration,
            isHealthy: true,
            lastHealthCheck: new Date(),
            metadata: {
                createdBy: userId,
                createdAt: new Date().toISOString(),
            },
        });
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Storage provider created: ${savedProvider.id} (${savedProvider.name})`);
        return savedProvider;
    }
    async updateProvider(id, updateDto, userId) {
        const provider = await this.getProviderById(id);
        if (updateDto.configuration) {
            const isValid = this.storageProviderFactory.validateConfiguration(provider.type, updateDto.configuration);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid storage provider configuration');
            }
            try {
                const storageService = this.storageProviderFactory.getProvider(provider.type, updateDto.configuration);
                const healthStatus = await storageService.healthCheck();
                if (!healthStatus.isHealthy) {
                    throw new common_1.BadRequestException(`Storage provider health check failed: ${healthStatus.error}`);
                }
            }
            catch (error) {
                throw new common_1.BadRequestException(`Storage provider configuration test failed: ${error.message}`);
            }
        }
        Object.assign(provider, updateDto);
        provider.metadata = {
            ...provider.metadata,
            updatedBy: userId,
            updatedAt: new Date().toISOString(),
        };
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Storage provider updated: ${savedProvider.id} (${savedProvider.name})`);
        return savedProvider;
    }
    async deleteProvider(id) {
        const provider = await this.getProviderById(id);
        if (provider.usageCount > 0) {
            throw new common_1.BadRequestException('Cannot delete storage provider that is currently in use');
        }
        await this.storageProviderRepository.remove(provider);
        this.logger.log(`Storage provider deleted: ${id} (${provider.name})`);
    }
    async activateProvider(id) {
        const provider = await this.getProviderById(id);
        try {
            const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
            const healthStatus = await storageService.healthCheck();
            if (!healthStatus.isHealthy) {
                throw new common_1.BadRequestException(`Cannot activate unhealthy storage provider: ${healthStatus.error}`);
            }
            provider.isHealthy = true;
            provider.healthCheckError = null;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Storage provider health check failed: ${error.message}`);
        }
        provider.isActive = true;
        provider.lastHealthCheck = new Date();
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Storage provider activated: ${savedProvider.id} (${savedProvider.name})`);
        return savedProvider;
    }
    async deactivateProvider(id) {
        const provider = await this.getProviderById(id);
        provider.isActive = false;
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Storage provider deactivated: ${savedProvider.id} (${savedProvider.name})`);
        return savedProvider;
    }
    async updateProviderPriority(id, priority) {
        if (priority < 1 || priority > 100) {
            throw new common_1.BadRequestException('Priority must be between 1 and 100');
        }
        const provider = await this.getProviderById(id);
        provider.priority = priority;
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Storage provider priority updated: ${savedProvider.id} (${savedProvider.name}) to ${priority}`);
        return savedProvider;
    }
    async updateProviderHealth(id, isHealthy, error) {
        const provider = await this.getProviderById(id);
        provider.isHealthy = isHealthy;
        provider.healthCheckError = error || null;
        provider.lastHealthCheck = new Date();
        return this.storageProviderRepository.save(provider);
    }
    async getProviderUsage(id) {
        const provider = await this.getProviderById(id);
        return {
            usageCount: provider.usageCount,
            totalStorageUsed: provider.totalStorageUsed,
            averageFileSize: provider.usageCount > 0 ? provider.totalStorageUsed / provider.usageCount : 0,
            fileCount: provider.usageCount,
        };
    }
    async getBestProvider() {
        const providers = await this.getActiveProviders();
        return providers.length > 0 ? providers[0] : null;
    }
    async switchToProvider(id) {
        const provider = await this.getProviderById(id);
        if (!provider.isActive) {
            throw new common_1.BadRequestException('Cannot switch to inactive storage provider');
        }
        if (!provider.isHealthy) {
            throw new common_1.BadRequestException('Cannot switch to unhealthy storage provider');
        }
        await this.storageProviderRepository
            .createQueryBuilder()
            .update(storage_provider_entity_1.StorageProvider)
            .set({ priority: () => 'priority + 1' })
            .where('id != :id', { id })
            .execute();
        provider.priority = 1;
        const savedProvider = await this.storageProviderRepository.save(provider);
        this.logger.log(`Switched to storage provider: ${savedProvider.id} (${savedProvider.name})`);
        return savedProvider;
    }
};
exports.StorageProviderService = StorageProviderService;
exports.StorageProviderService = StorageProviderService = StorageProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(storage_provider_entity_1.StorageProvider)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        storage_provider_factory_service_1.StorageProviderFactoryService])
], StorageProviderService);
//# sourceMappingURL=storage-provider.service.js.map