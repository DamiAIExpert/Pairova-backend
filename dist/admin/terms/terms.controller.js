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
exports.TermsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terms_service_1 = require("./terms.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const policy_type_enum_1 = require("../../common/enums/policy-type.enum");
const update_policy_dto_1 = require("./dto/update-policy.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
let TermsController = class TermsController {
    termsService;
    constructor(termsService) {
        this.termsService = termsService;
    }
    current(type) {
        return this.termsService.getPolicy(type);
    }
    update(type, dto, admin) {
        return this.termsService.updatePolicy(type, dto, admin);
    }
};
exports.TermsController = TermsController;
__decorate([
    (0, common_1.Get)(':type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the current version of a policy' }),
    (0, swagger_1.ApiParam)({ name: 'type', enum: policy_type_enum_1.PolicyType, description: 'The type of policy to retrieve.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The policy document.' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TermsController.prototype, "current", null);
__decorate([
    (0, common_1.Put)(':type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a policy document (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'type', enum: policy_type_enum_1.PolicyType, description: 'The type of policy to update.' }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_policy_dto_1.UpdatePolicyDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TermsController.prototype, "update", null);
exports.TermsController = TermsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin/terms'),
    __metadata("design:paramtypes", [terms_service_1.TermsService])
], TermsController);
//# sourceMappingURL=terms.controller.js.map