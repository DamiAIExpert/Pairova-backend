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
exports.FileUpload = void 0;
const typeorm_1 = require("typeorm");
const storage_provider_entity_1 = require("./storage-provider.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const file_type_enum_1 = require("../../common/enums/file-type.enum");
let FileUpload = class FileUpload {
    id;
    filename;
    originalFilename;
    mimeType;
    size;
    url;
    thumbnailUrl;
    fileType;
    folder;
    metadata;
    publicId;
    isPublic;
    userId;
    user;
    storageProviderId;
    storageProvider;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.FileUpload = FileUpload;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileUpload.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileUpload.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileUpload.prototype, "originalFilename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileUpload.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FileUpload.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileUpload.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: file_type_enum_1.FileType }),
    __metadata("design:type", String)
], FileUpload.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "folder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], FileUpload.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "publicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FileUpload.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileUpload.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], FileUpload.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileUpload.prototype, "storageProviderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => storage_provider_entity_1.StorageProvider),
    (0, typeorm_1.JoinColumn)({ name: 'storageProviderId' }),
    __metadata("design:type", storage_provider_entity_1.StorageProvider)
], FileUpload.prototype, "storageProvider", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FileUpload.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FileUpload.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], FileUpload.prototype, "deletedAt", void 0);
exports.FileUpload = FileUpload = __decorate([
    (0, typeorm_1.Entity)('file_uploads'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['storageProviderId', 'createdAt'])
], FileUpload);
//# sourceMappingURL=file-upload.entity.js.map