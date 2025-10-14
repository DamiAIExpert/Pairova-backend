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
exports.StorageProvider = void 0;
const typeorm_1 = require("typeorm");
const storage_type_enum_1 = require("../../common/enums/storage-type.enum");
const file_upload_entity_1 = require("./file-upload.entity");
let StorageProvider = class StorageProvider {
    id;
    name;
    type;
    isActive;
    priority;
    configuration;
    description;
    usageCount;
    totalStorageUsed;
    isHealthy;
    lastHealthCheck;
    healthCheckError;
    metadata;
    createdAt;
    updatedAt;
    files;
};
exports.StorageProvider = StorageProvider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StorageProvider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], StorageProvider.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: storage_type_enum_1.StorageType }),
    __metadata("design:type", String)
], StorageProvider.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StorageProvider.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], StorageProvider.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], StorageProvider.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StorageProvider.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], StorageProvider.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], StorageProvider.prototype, "totalStorageUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], StorageProvider.prototype, "isHealthy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], StorageProvider.prototype, "lastHealthCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StorageProvider.prototype, "healthCheckError", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], StorageProvider.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StorageProvider.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StorageProvider.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => file_upload_entity_1.FileUpload, (file) => file.storageProvider),
    __metadata("design:type", Array)
], StorageProvider.prototype, "files", void 0);
exports.StorageProvider = StorageProvider = __decorate([
    (0, typeorm_1.Entity)('storage_providers')
], StorageProvider);
//# sourceMappingURL=storage-provider.entity.js.map