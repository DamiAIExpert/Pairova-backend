"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const storage_provider_entity_1 = require("./entities/storage-provider.entity");
const file_upload_entity_1 = require("./entities/file-upload.entity");
const storage_provider_service_1 = require("./services/storage-provider.service");
const file_storage_service_1 = require("./services/file-storage.service");
const storage_provider_factory_service_1 = require("./services/storage-provider-factory.service");
const cloudinary_storage_service_1 = require("./services/cloudinary-storage.service");
const aws_s3_storage_service_1 = require("./services/aws-s3-storage.service");
const google_cloud_storage_service_1 = require("./services/google-cloud-storage.service");
const admin_storage_controller_1 = require("./controllers/admin-storage.controller");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([storage_provider_entity_1.StorageProvider, file_upload_entity_1.FileUpload]),
        ],
        controllers: [admin_storage_controller_1.AdminStorageController],
        providers: [
            storage_provider_service_1.StorageProviderService,
            file_storage_service_1.FileStorageService,
            storage_provider_factory_service_1.StorageProviderFactoryService,
            cloudinary_storage_service_1.CloudinaryStorageService,
            aws_s3_storage_service_1.AwsS3StorageService,
            google_cloud_storage_service_1.GoogleCloudStorageService,
        ],
        exports: [
            storage_provider_service_1.StorageProviderService,
            file_storage_service_1.FileStorageService,
            storage_provider_factory_service_1.StorageProviderFactoryService,
        ],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map