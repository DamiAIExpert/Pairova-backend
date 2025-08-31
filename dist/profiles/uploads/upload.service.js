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
const cloudinary_storage_1 = require("./cloudinary.storage");
const upload_entity_1 = require("./entities/upload.entity");
let UploadService = class UploadService {
    uploadsRepo;
    constructor(uploadsRepo) {
        this.uploadsRepo = uploadsRepo;
    }
    async processAndRecordUpload(file, user, kind = 'general') {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!user?.id) {
            throw new common_1.BadRequestException('Missing authenticated user');
        }
        const uploaded = await (0, cloudinary_storage_1.uploadToCloudinary)(file, {
            folder: `pairova/${kind}`,
            resource_type: 'auto',
        });
        const record = this.uploadsRepo.create({
            userId: user.id,
            kind,
            fileUrl: uploaded.url,
            publicId: uploaded.publicId,
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
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UploadService);
//# sourceMappingURL=upload.service.js.map