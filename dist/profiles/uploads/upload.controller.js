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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const upload_dto_1 = require("./dto/upload.dto");
const cloudinary_storage_1 = require("./cloudinary.storage");
let UploadController = class UploadController {
    uploadService;
    configService;
    constructor(uploadService, configService) {
        this.uploadService = uploadService;
        this.configService = configService;
        (0, cloudinary_storage_1.configureCloudinary)(this.configService);
    }
    async uploadFile(file, user, kind = 'general') {
        return this.uploadService.processAndRecordUpload(file, user, kind);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a file for the current user' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'kind',
        type: 'string',
        required: false,
        description: "Type of upload (e.g., 'avatar', 'resume')",
        example: 'resume',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'File uploaded successfully.',
        type: upload_dto_1.UploadDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', (0, cloudinary_storage_1.getMulterMemoryStorage)())),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({
                fileType: /(image\/jpeg|image\/png|application\/pdf)/,
            }),
        ],
    }))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Profile - Uploads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles/uploads'),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        config_1.ConfigService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map