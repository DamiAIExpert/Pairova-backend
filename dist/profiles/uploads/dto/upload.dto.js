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
exports.UploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadDto {
    id;
    url;
    publicId;
    mimeType;
    sizeBytes;
    filename;
}
exports.UploadDto = UploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique ID of the upload record in the database.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' }),
    __metadata("design:type", String)
], UploadDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The URL where the file can be accessed.', example: 'https://res.cloudinary.com/demo/image/upload/v1582222222/pairova/sample.jpg' }),
    __metadata("design:type", String)
], UploadDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The public ID of the file in the storage provider (e.g., Cloudinary).', example: 'pairova/sample' }),
    __metadata("design:type", String)
], UploadDto.prototype, "publicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The MIME type of the uploaded file.', example: 'image/jpeg' }),
    __metadata("design:type", String)
], UploadDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The size of the file in bytes.', example: 102400 }),
    __metadata("design:type", Number)
], UploadDto.prototype, "sizeBytes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The original filename.', example: 'resume.pdf', required: false }),
    __metadata("design:type", String)
], UploadDto.prototype, "filename", void 0);
//# sourceMappingURL=upload.dto.js.map