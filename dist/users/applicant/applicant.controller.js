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
exports.ApplicantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const applicant_service_1 = require("./applicant.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../shared/user.entity");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const update_applicant_profile_dto_1 = require("./dto/update-applicant-profile.dto");
const applicant_entity_1 = require("./applicant.entity");
let ApplicantController = class ApplicantController {
    applicantService;
    constructor(applicantService) {
        this.applicantService = applicantService;
    }
    me(user) {
        return this.applicantService.getProfile(user);
    }
    update(user, updateDto) {
        return this.applicantService.updateProfile(user, updateDto);
    }
};
exports.ApplicantController = ApplicantController;
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.APPLICANT),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current applicant\'s profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The applicant profile.', type: applicant_entity_1.ApplicantProfile }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User is not an applicant.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "me", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.APPLICANT),
    (0, swagger_1.ApiOperation)({ summary: 'Update the current applicant\'s profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The updated applicant profile.', type: applicant_entity_1.ApplicantProfile }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - User is not an applicant.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        update_applicant_profile_dto_1.UpdateApplicantProfileDto]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "update", null);
exports.ApplicantController = ApplicantController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('profiles/applicant'),
    __metadata("design:paramtypes", [applicant_service_1.ApplicantService])
], ApplicantController);
//# sourceMappingURL=applicant.controller.js.map