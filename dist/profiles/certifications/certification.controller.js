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
exports.CertificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const certification_service_1 = require("./certification.service");
const create_certification_dto_1 = require("./dto/create-certification.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const certification_entity_1 = require("./entities/certification.entity");
let CertificationController = class CertificationController {
    certificationService;
    constructor(certificationService) {
        this.certificationService = certificationService;
    }
    add(user, createCertificationDto) {
        return this.certificationService.add(user, createCertificationDto);
    }
    findAll(user) {
        return this.certificationService.findAllByUserId(user.id);
    }
    async remove(id, user) {
        const certification = await this.certificationService.findOneById(id);
        if (certification.userId !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to delete this certification.');
        }
        return this.certificationService.remove(id);
    }
};
exports.CertificationController = CertificationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Add a new certification to the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The certification has been successfully created.', type: certification_entity_1.Certification }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_certification_dto_1.CreateCertificationDto]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "add", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all certifications for the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A list of the user\'s certifications.', type: [certification_entity_1.Certification] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a certification from the current user\'s profile' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'The certification has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User does not own this resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found - The certification with the given ID does not exist.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "remove", null);
exports.CertificationController = CertificationController = __decorate([
    (0, swagger_1.ApiTags)('Profile - Certifications'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles/certifications'),
    __metadata("design:paramtypes", [certification_service_1.CertificationService])
], CertificationController);
//# sourceMappingURL=certification.controller.js.map