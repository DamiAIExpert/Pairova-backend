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
exports.SimpleUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let SimpleUploadController = class SimpleUploadController {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadFile(file, user) {
        console.log('🎯 [SimpleUploadController] Endpoint hit!');
        console.log('📦 File:', file ? `${file.originalname} (${file.mimetype}, ${file.size} bytes)` : 'NO FILE');
        console.log('👤 User:', user?.id);
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!file.buffer) {
            throw new common_1.BadRequestException('File buffer is empty');
        }
        try {
            console.log('⬆️  Uploading to Cloudinary...');
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: 'pairova/logos',
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary error:', error);
                        reject(error);
                    }
                    else {
                        console.log('✅ Cloudinary upload success:', result?.secure_url);
                        resolve(result);
                    }
                });
                uploadStream.end(file.buffer);
            });
            return {
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                width: result.width,
                height: result.height,
            };
        }
        catch (error) {
            console.error('❌ Upload failed:', error);
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
};
exports.SimpleUploadController = SimpleUploadController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Simple file upload directly to Cloudinary' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SimpleUploadController.prototype, "uploadFile", null);
exports.SimpleUploadController = SimpleUploadController = __decorate([
    (0, swagger_1.ApiTags)('File Uploads - Simple'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('uploads/simple'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SimpleUploadController);
//# sourceMappingURL=simple-upload.controller.js.map