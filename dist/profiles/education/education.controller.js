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
exports.EducationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const education_service_1 = require("./education.service");
const create_education_dto_1 = require("./dto/create-education.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const education_entity_1 = require("./entities/education.entity");
let EducationController = class EducationController {
    educationService;
    constructor(educationService) {
        this.educationService = educationService;
    }
    add(user, createEducationDto) {
        return this.educationService.addEducation(user, createEducationDto);
    }
    findAll(user) {
        return this.educationService.findByUserId(user.id);
    }
};
exports.EducationController = EducationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Add an education entry to the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The education entry has been successfully created.', type: education_entity_1.Education }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_education_dto_1.CreateEducationDto]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "add", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all education entries for the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A list of education entries.', type: [education_entity_1.Education] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "findAll", null);
exports.EducationController = EducationController = __decorate([
    (0, swagger_1.ApiTags)('Profile - Education'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles/education'),
    __metadata("design:paramtypes", [education_service_1.EducationService])
], EducationController);
//# sourceMappingURL=education.controller.js.map