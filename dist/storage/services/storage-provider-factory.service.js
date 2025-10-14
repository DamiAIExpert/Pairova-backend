"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageProviderFactoryService = void 0;
const common_1 = require("@nestjs/common");
const storage_type_enum_1 = require("../../common/enums/storage-type.enum");
const cloudinary_storage_service_1 = require("./cloudinary-storage.service");
const aws_s3_storage_service_1 = require("./aws-s3-storage.service");
const google_cloud_storage_service_1 = require("./google-cloud-storage.service");
let StorageProviderFactoryService = class StorageProviderFactoryService {
    providers = new Map();
    createProvider(type, configuration) {
        let provider;
        switch (type) {
            case storage_type_enum_1.StorageType.CLOUDINARY:
                provider = new cloudinary_storage_service_1.CloudinaryStorageService();
                provider.initialize(configuration);
                break;
            case storage_type_enum_1.StorageType.AWS_S3:
                provider = new aws_s3_storage_service_1.AwsS3StorageService();
                provider.initialize(configuration);
                break;
            case storage_type_enum_1.StorageType.GOOGLE_CLOUD_STORAGE:
                provider = new google_cloud_storage_service_1.GoogleCloudStorageService();
                provider.initialize(configuration);
                break;
            case storage_type_enum_1.StorageType.AZURE_BLOB:
                throw new Error('Azure Blob Storage not implemented yet');
            case storage_type_enum_1.StorageType.LOCAL:
                throw new Error('Local Storage not implemented yet');
            default:
                throw new Error(`Unsupported storage type: ${type}`);
        }
        return provider;
    }
    getProvider(type, configuration) {
        const key = `${type}_${JSON.stringify(configuration)}`;
        if (!this.providers.has(key)) {
            const provider = this.createProvider(type, configuration);
            this.providers.set(key, provider);
        }
        return this.providers.get(key);
    }
    clearCache() {
        this.providers.clear();
    }
    validateConfiguration(type, configuration) {
        try {
            switch (type) {
                case storage_type_enum_1.StorageType.CLOUDINARY:
                    return this.validateCloudinaryConfig(configuration);
                case storage_type_enum_1.StorageType.AWS_S3:
                    return this.validateAwsS3Config(configuration);
                case storage_type_enum_1.StorageType.GOOGLE_CLOUD_STORAGE:
                    return this.validateGoogleCloudConfig(configuration);
                case storage_type_enum_1.StorageType.AZURE_BLOB:
                    return this.validateAzureBlobConfig(configuration);
                case storage_type_enum_1.StorageType.LOCAL:
                    return this.validateLocalConfig(configuration);
                default:
                    return false;
            }
        }
        catch (error) {
            return false;
        }
    }
    validateCloudinaryConfig(config) {
        return config &&
            typeof config.cloudName === 'string' &&
            typeof config.apiKey === 'string' &&
            typeof config.apiSecret === 'string';
    }
    validateAwsS3Config(config) {
        return config &&
            typeof config.bucketName === 'string' &&
            typeof config.accessKeyId === 'string' &&
            typeof config.secretAccessKey === 'string';
    }
    validateGoogleCloudConfig(config) {
        try {
            return config &&
                typeof config.projectId === 'string' &&
                typeof config.bucketName === 'string' &&
                typeof config.serviceAccountKey === 'string' &&
                JSON.parse(config.serviceAccountKey);
        }
        catch (error) {
            return false;
        }
    }
    validateAzureBlobConfig(config) {
        return config &&
            typeof config.accountName === 'string' &&
            typeof config.accountKey === 'string' &&
            typeof config.containerName === 'string';
    }
    validateLocalConfig(config) {
        return config &&
            typeof config.uploadPath === 'string' &&
            typeof config.baseUrl === 'string';
    }
    getSupportedTypes() {
        return [
            storage_type_enum_1.StorageType.CLOUDINARY,
            storage_type_enum_1.StorageType.AWS_S3,
            storage_type_enum_1.StorageType.GOOGLE_CLOUD_STORAGE,
        ];
    }
    getTypeDescription(type) {
        switch (type) {
            case storage_type_enum_1.StorageType.CLOUDINARY:
                return 'Cloud-based image and video management service with built-in transformations';
            case storage_type_enum_1.StorageType.AWS_S3:
                return 'Amazon Simple Storage Service - scalable object storage';
            case storage_type_enum_1.StorageType.GOOGLE_CLOUD_STORAGE:
                return 'Google Cloud Storage - unified object storage for developers';
            case storage_type_enum_1.StorageType.AZURE_BLOB:
                return 'Microsoft Azure Blob Storage - cloud storage solution';
            case storage_type_enum_1.StorageType.LOCAL:
                return 'Local file system storage';
            default:
                return 'Unknown storage type';
        }
    }
};
exports.StorageProviderFactoryService = StorageProviderFactoryService;
exports.StorageProviderFactoryService = StorageProviderFactoryService = __decorate([
    (0, common_1.Injectable)()
], StorageProviderFactoryService);
//# sourceMappingURL=storage-provider-factory.service.js.map