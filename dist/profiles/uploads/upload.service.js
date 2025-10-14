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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_storage_service_1 = require("../../storage/services/file-storage.service");
const file_type_enum_1 = require("../../common/enums/file-type.enum");
const upload_entity_1 = require("./entities/upload.entity");
let UploadService = class UploadService {
    uploadsRepo;
    fileStorageService;
    constructor(uploadsRepo, fileStorageService) {
        this.uploadsRepo = uploadsRepo;
        this.fileStorageService = fileStorageService;
    }
    async processAndRecordUpload(file, user, kind = 'general', fileType) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!user?.id) {
            throw new common_1.BadRequestException('Missing authenticated user');
        }
        const resolvedFileType = fileType || this.mapKindToFileType(kind);
        const uploadedFile = await this.fileStorageService.uploadFile(file, user.id, resolvedFileType, {
            folder: `pairova/${kind}`,
            isPublic: false,
            metadata: { kind, originalUpload: true },
        });
        const record = this.uploadsRepo.create({
            userId: user.id,
            kind,
            fileUrl: uploadedFile.url,
            publicId: uploadedFile.publicId || uploadedFile.id,
            mimeType: file.mimetype,
            sizeBytes: file.size ?? 0,
        });
        const saved = await this.uploadsRepo.save(record);
        const dto = {
            id: saved.id,
            url: saved.fileUrl,
            publicId: saved.publicId,
            mimeType: saved.mimeType,
            sizeBytes: saved.sizeBytes,
        };
        return dto;
    }
    async listUserUploads(userId, kind) {
        const where = kind ? { userId, kind } : { userId };
        const rows = await this.uploadsRepo.find({ where, order: { createdAt: 'DESC' } });
        return rows.map((u) => ({
            id: u.id,
            url: u.fileUrl,
            publicId: u.publicId,
            mimeType: u.mimeType,
            sizeBytes: u.sizeBytes,
        }));
    }
    mapKindToFileType(kind) {
        switch (kind.toLowerCase()) {
            case 'avatar':
            case 'profile':
                return file_type_enum_1.FileType.PROFILE_PICTURE;
            case 'resume':
            case 'cv':
                return file_type_enum_1.FileType.RESUME;
            case 'cover-letter':
                return file_type_enum_1.FileType.COVER_LETTER;
            case 'certificate':
                return file_type_enum_1.FileType.CERTIFICATE;
            case 'logo':
                return file_type_enum_1.FileType.COMPANY_LOGO;
            case 'ngo-logo':
                return file_type_enum_1.FileType.NGO_LOGO;
            case 'image':
            case 'photo':
                return file_type_enum_1.FileType.IMAGE;
            case 'document':
            case 'doc':
                return file_type_enum_1.FileType.DOCUMENT;
            default:
                return file_type_enum_1.FileType.OTHER;
        }
    }
    async deleteUpload(uploadId, userId) {
        const upload = await this.uploadsRepo.findOne({
            where: { id: uploadId, userId },
        });
        if (!upload) {
            throw new common_1.BadRequestException('Upload not found');
        }
        await this.fileStorageService.deleteFile(uploadId, userId);
        await this.uploadsRepo.remove(upload);
        return true;
    }
    async getUserUploadStats(userId) {
        const uploads = await this.uploadsRepo.find({ where: { userId } });
        const stats = {
            totalUploads: uploads.length,
            totalSize: uploads.reduce((sum, upload) => sum + upload.sizeBytes, 0),
            uploadsByKind: {},
        };
        uploads.forEach(upload => {
            stats.uploadsByKind[upload.kind] = (stats.uploadsByKind[upload.kind] || 0) + 1;
        });
        return stats;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        file_storage_service_1.FileStorageService])
], UploadService);
//# sourceMappingURL=upload.service.js.map