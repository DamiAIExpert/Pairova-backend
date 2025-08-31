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
exports.ExperienceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const experience_service_1 = require("./experience.service");
const create_experience_dto_1 = require("./dto/create-experience.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const experience_entity_1 = require("./entities/experience.entity");
let ExperienceController = class ExperienceController {
    experienceService;
    constructor(experienceService) {
        this.experienceService = experienceService;
    }
    add(user, createExperienceDto) {
        return this.experienceService.addExperience(user, createExperienceDto);
    }
    findAll(user) {
        return this.experienceService.findByUserId(user.id);
    }
};
exports.ExperienceController = ExperienceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Add a work experience entry to the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The experience entry has been successfully created.', type: experience_entity_1.Experience }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_experience_dto_1.CreateExperienceDto]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "add", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all work experience entries for the current user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'A list of work experience entries.', type: [experience_entity_1.Experience] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExperienceController.prototype, "findAll", null);
exports.ExperienceController = ExperienceController = __decorate([
    (0, swagger_1.ApiTags)('Profile - Experience'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles/experience'),
    __metadata("design:paramtypes", [experience_service_1.ExperienceService])
], ExperienceController);
//# sourceMappingURL=experience.controller.js.map