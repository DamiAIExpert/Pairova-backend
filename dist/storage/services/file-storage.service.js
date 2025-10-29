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
var FileStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const storage_provider_entity_1 = require("../entities/storage-provider.entity");
const file_upload_entity_1 = require("../entities/file-upload.entity");
const storage_provider_factory_service_1 = require("./storage-provider-factory.service");
const file_type_enum_1 = require("../../common/enums/file-type.enum");
let FileStorageService = FileStorageService_1 = class FileStorageService {
    storageProviderRepository;
    fileUploadRepository;
    storageProviderFactory;
    logger = new common_1.Logger(FileStorageService_1.name);
    constructor(storageProviderRepository, fileUploadRepository, storageProviderFactory) {
        this.storageProviderRepository = storageProviderRepository;
        this.fileUploadRepository = fileUploadRepository;
        this.storageProviderFactory = storageProviderFactory;
    }
    async uploadFile(file, userId, fileType = file_type_enum_1.FileType.OTHER, options = {}) {
        try {
            this.logger.log('🔍 [FileStorageService] Starting file upload...');
            this.logger.log(`📦 File: ${file.originalname}, Size: ${file.size}, Type: ${file.mimetype}`);
            this.logger.log('🔍 Getting best storage provider...');
            const provider = await this.getBestStorageProvider();
            if (!provider) {
                this.logger.error('❌ No active storage providers available');
                throw new common_1.BadRequestException('No active storage providers available');
            }
            this.logger.log(`✅ Found provider: ${provider.name} (${provider.type})`);
            this.logger.log('🔍 Validating file...');
            this.validateFile(file);
            this.logger.log('✅ File validation passed');
            this.logger.log('🔍 Getting storage provider instance...');
            const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
            this.logger.log('✅ Storage provider instance created');
            this.logger.log('⬆️  Uploading to storage...');
            const uploadResult = await storageService.upload(file, options);
            this.logger.log('✅ Upload to storage successful:', uploadResult.url);
            const fileUpload = this.fileUploadRepository.create({
                filename: file.filename || file.originalname,
                originalFilename: file.originalname,
                mimeType: file.mimetype,
                size: uploadResult.size,
                url: uploadResult.url,
                thumbnailUrl: uploadResult.thumbnailUrl,
                fileType,
                folder: options.folder,
                metadata: {
                    ...uploadResult.metadata,
                    ...options.metadata,
                },
                publicId: uploadResult.publicId,
                isPublic: options.isPublic || false,
                userId,
                storageProviderId: provider.id,
            });
            const savedFile = await this.fileUploadRepository.save(fileUpload);
            await this.updateProviderUsage(provider.id, uploadResult.size);
            this.logger.log(`File uploaded successfully: ${savedFile.id} via ${provider.name}`);
            return savedFile;
        }
        catch (error) {
            this.logger.error(`File upload failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteFile(fileId, userId) {
        try {
            const file = await this.fileUploadRepository.findOne({
                where: { id: fileId, userId },
                relations: ['storageProvider'],
            });
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            const storageService = this.storageProviderFactory.getProvider(file.storageProvider.type, file.storageProvider.configuration);
            await storageService.delete(file.publicId);
            file.deletedAt = new Date();
            await this.fileUploadRepository.save(file);
            await this.updateProviderUsage(file.storageProvider.id, -file.size);
            this.logger.log(`File deleted successfully: ${fileId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`File deletion failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getFile(fileId, userId) {
        const where = { id: fileId };
        if (userId) {
            where.userId = userId;
        }
        const file = await this.fileUploadRepository.findOne({
            where,
            relations: ['storageProvider', 'user'],
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        return file;
    }
    async getUserFiles(userId, fileType, limit = 50, offset = 0) {
        const query = this.fileUploadRepository.createQueryBuilder('file')
            .where('file.userId = :userId', { userId })
            .andWhere('file.deletedAt IS NULL')
            .orderBy('file.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);
        if (fileType) {
            query.andWhere('file.fileType = :fileType', { fileType });
        }
        const [files, total] = await query.getManyAndCount();
        return { files, total };
    }
    async getBestStorageProvider() {
        const providers = await this.storageProviderRepository.find({
            where: { isActive: true, isHealthy: true },
            order: { priority: 'ASC' },
        });
        if (providers.length === 0) {
            return null;
        }
        return providers[0];
    }
    async getAllStorageProviders() {
        return this.storageProviderRepository.find({
            order: { priority: 'ASC' },
        });
    }
    async performHealthCheck(providerId) {
        const where = {};
        if (providerId) {
            where.id = providerId;
        }
        const providers = await this.storageProviderRepository.find({ where });
        for (const provider of providers) {
            try {
                const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
                const healthStatus = await storageService.healthCheck();
                provider.isHealthy = healthStatus.isHealthy;
                provider.lastHealthCheck = new Date();
                provider.healthCheckError = healthStatus.error || null;
                await this.storageProviderRepository.save(provider);
                this.logger.log(`Health check completed for ${provider.name}: ${healthStatus.isHealthy ? 'healthy' : 'unhealthy'}`);
            }
            catch (error) {
                this.logger.error(`Health check failed for ${provider.name}: ${error.message}`);
                provider.isHealthy = false;
                provider.lastHealthCheck = new Date();
                provider.healthCheckError = error.message;
                await this.storageProviderRepository.save(provider);
            }
        }
    }
    async getStorageUsage() {
        const providers = await this.getAllStorageProviders();
        const stats = await this.fileUploadRepository
            .createQueryBuilder('file')
            .select([
            'COUNT(*) as totalFiles',
            'SUM(file.size) as totalStorage',
        ])
            .where('file.deletedAt IS NULL')
            .getRawOne();
        return {
            totalFiles: parseInt(stats.totalFiles) || 0,
            totalStorage: parseInt(stats.totalStorage) || 0,
            providers: providers.map(provider => ({
                id: provider.id,
                name: provider.name,
                type: provider.type,
                usageCount: provider.usageCount,
                totalStorageUsed: provider.totalStorageUsed,
                isHealthy: provider.isHealthy,
            })),
        };
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size exceeds 10MB limit');
        }
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/zip',
            'application/x-zip-compressed',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`File type ${file.mimetype} is not allowed`);
        }
    }
    async updateProviderUsage(providerId, sizeChange) {
        await this.storageProviderRepository
            .createQueryBuilder()
            .update(storage_provider_entity_1.StorageProvider)
            .set({
            usageCount: () => 'usageCount + 1',
            totalStorageUsed: () => `totalStorageUsed + ${sizeChange}`,
        })
            .where('id = :id', { id: providerId })
            .execute();
    }
    async generateSignedUrl(fileId, userId, expiresIn = 3600) {
        const file = await this.getFile(fileId, userId);
        const storageService = this.storageProviderFactory.getProvider(file.storageProvider.type, file.storageProvider.configuration);
        return storageService.generateUrl(file.publicId);
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = FileStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(storage_provider_entity_1.StorageProvider)),
    __param(1, (0, typeorm_1.InjectRepository)(file_upload_entity_1.FileUpload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        storage_provider_factory_service_1.StorageProviderFactoryService])
], FileStorageService);
//# sourceMappingURL=file-storage.service.js.map