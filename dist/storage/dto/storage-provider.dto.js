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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadResponseDto = exports.FileUploadDto = exports.StorageProviderHealthDto = exports.StorageProviderResponseDto = exports.UpdateStorageProviderDto = exports.CreateStorageProviderDto = exports.LocalConfigDto = exports.AzureBlobConfigDto = exports.GoogleCloudConfigDto = exports.AwsS3ConfigDto = exports.CloudinaryConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const storage_type_enum_1 = require("../../common/enums/storage-type.enum");
class CloudinaryConfigDto {
    cloudName;
    apiKey;
    apiSecret;
    defaultFolder;
    defaultTransformations;
}
exports.CloudinaryConfigDto = CloudinaryConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cloudinary cloud name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CloudinaryConfigDto.prototype, "cloudName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cloudinary API key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CloudinaryConfigDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cloudinary API secret' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CloudinaryConfigDto.prototype, "apiSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Default folder for uploads', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CloudinaryConfigDto.prototype, "defaultFolder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Default transformation settings', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CloudinaryConfigDto.prototype, "defaultTransformations", void 0);
class AwsS3ConfigDto {
    bucketName;
    accessKeyId;
    secretAccessKey;
    region;
    endpoint;
    defaultFolder;
}
exports.AwsS3ConfigDto = AwsS3ConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AWS S3 bucket name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "bucketName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AWS access key ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "accessKeyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AWS secret access key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "secretAccessKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AWS region', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'S3 endpoint URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "endpoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Default folder for uploads', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AwsS3ConfigDto.prototype, "defaultFolder", void 0);
class GoogleCloudConfigDto {
    projectId;
    bucketName;
    serviceAccountKey;
    defaultFolder;
}
exports.GoogleCloudConfigDto = GoogleCloudConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google Cloud project ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleCloudConfigDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google Cloud Storage bucket name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleCloudConfigDto.prototype, "bucketName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google Cloud service account key (JSON)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleCloudConfigDto.prototype, "serviceAccountKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Default folder for uploads', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GoogleCloudConfigDto.prototype, "defaultFolder", void 0);
class AzureBlobConfigDto {
    accountName;
    accountKey;
    containerName;
    defaultFolder;
}
exports.AzureBlobConfigDto = AzureBlobConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Azure storage account name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AzureBlobConfigDto.prototype, "accountName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Azure storage account key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AzureBlobConfigDto.prototype, "accountKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Azure container name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AzureBlobConfigDto.prototype, "containerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Default folder for uploads', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AzureBlobConfigDto.prototype, "defaultFolder", void 0);
class LocalConfigDto {
    uploadPath;
    baseUrl;
    maxFileSize;
}
exports.LocalConfigDto = LocalConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Local storage directory path' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocalConfigDto.prototype, "uploadPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base URL for serving files' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocalConfigDto.prototype, "baseUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum file size in bytes', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LocalConfigDto.prototype, "maxFileSize", void 0);
class CreateStorageProviderDto {
    name;
    type;
    description;
    priority;
    isActive;
    configuration;
}
exports.CreateStorageProviderDto = CreateStorageProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name', example: 'Cloudinary Production' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStorageProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Storage type', enum: storage_type_enum_1.StorageType }),
    (0, class_validator_1.IsEnum)(storage_type_enum_1.StorageType),
    __metadata("design:type", String)
], CreateStorageProviderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStorageProviderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority order (lower number = higher priority)', minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateStorageProviderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this provider is active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStorageProviderDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider configuration',
        oneOf: [
            { $ref: '#/components/schemas/CloudinaryConfigDto' },
            { $ref: '#/components/schemas/AwsS3ConfigDto' },
            { $ref: '#/components/schemas/GoogleCloudConfigDto' },
            { $ref: '#/components/schemas/AzureBlobConfigDto' },
            { $ref: '#/components/schemas/LocalConfigDto' }
        ]
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], CreateStorageProviderDto.prototype, "configuration", void 0);
class UpdateStorageProviderDto {
    name;
    description;
    priority;
    isActive;
    configuration;
}
exports.UpdateStorageProviderDto = UpdateStorageProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStorageProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStorageProviderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority order', minimum: 1, maximum: 100, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStorageProviderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this provider is active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStorageProviderDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider configuration', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStorageProviderDto.prototype, "configuration", void 0);
class StorageProviderResponseDto {
    id;
    name;
    type;
    isActive;
    priority;
    description;
    usageCount;
    totalStorageUsed;
    isHealthy;
    lastHealthCheck;
    healthCheckError;
    createdAt;
    updatedAt;
    metadata;
}
exports.StorageProviderResponseDto = StorageProviderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider ID' }),
    __metadata("design:type", String)
], StorageProviderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name' }),
    __metadata("design:type", String)
], StorageProviderResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Storage type', enum: storage_type_enum_1.StorageType }),
    __metadata("design:type", String)
], StorageProviderResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether this provider is active' }),
    __metadata("design:type", Boolean)
], StorageProviderResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority order' }),
    __metadata("design:type", Number)
], StorageProviderResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider description' }),
    __metadata("design:type", String)
], StorageProviderResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usage count' }),
    __metadata("design:type", Number)
], StorageProviderResponseDto.prototype, "usageCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total storage used in bytes' }),
    __metadata("design:type", Number)
], StorageProviderResponseDto.prototype, "totalStorageUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether provider is healthy' }),
    __metadata("design:type", Boolean)
], StorageProviderResponseDto.prototype, "isHealthy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last health check timestamp' }),
    __metadata("design:type", Date)
], StorageProviderResponseDto.prototype, "lastHealthCheck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Health check error message' }),
    __metadata("design:type", String)
], StorageProviderResponseDto.prototype, "healthCheckError", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], StorageProviderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    __metadata("design:type", Date)
], StorageProviderResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider metadata' }),
    __metadata("design:type", Object)
], StorageProviderResponseDto.prototype, "metadata", void 0);
class StorageProviderHealthDto {
    id;
    name;
    type;
    isHealthy;
    responseTime;
    error;
    checkedAt;
    status;
}
exports.StorageProviderHealthDto = StorageProviderHealthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider ID' }),
    __metadata("design:type", String)
], StorageProviderHealthDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name' }),
    __metadata("design:type", String)
], StorageProviderHealthDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Storage type', enum: storage_type_enum_1.StorageType }),
    __metadata("design:type", String)
], StorageProviderHealthDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether provider is healthy' }),
    __metadata("design:type", Boolean)
], StorageProviderHealthDto.prototype, "isHealthy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Health check response time in ms' }),
    __metadata("design:type", Number)
], StorageProviderHealthDto.prototype, "responseTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Health check error message' }),
    __metadata("design:type", String)
], StorageProviderHealthDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Health check timestamp' }),
    __metadata("design:type", Date)
], StorageProviderHealthDto.prototype, "checkedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider status details' }),
    __metadata("design:type", Object)
], StorageProviderHealthDto.prototype, "status", void 0);
class FileUploadDto {
    file;
    fileType;
    folder;
    isPublic;
    metadata;
}
exports.FileUploadDto = FileUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File to upload', type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], FileUploadDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File type', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FileUploadDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Folder path', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FileUploadDto.prototype, "folder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether file should be public', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FileUploadDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FileUploadDto.prototype, "metadata", void 0);
class FileUploadResponseDto {
    id;
    url;
    thumbnailUrl;
    size;
    mimeType;
    fileType;
    storageProvider;
    uploadedAt;
}
exports.FileUploadResponseDto = FileUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File ID' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File URL' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thumbnail URL', required: false }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], FileUploadResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File type' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Storage provider used' }),
    __metadata("design:type", String)
], FileUploadResponseDto.prototype, "storageProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Upload timestamp' }),
    __metadata("design:type", Date)
], FileUploadResponseDto.prototype, "uploadedAt", void 0);
//# sourceMappingURL=storage-provider.dto.js.map