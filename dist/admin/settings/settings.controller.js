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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const update_email_settings_dto_1 = require("./dto/update-email-settings.dto");
const update_sms_settings_dto_1 = require("./dto/update-sms-settings.dto");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getEmailSettings() {
        return this.settingsService.getEmailSettings();
    }
    upsertEmailSettings(dto, admin) {
        return this.settingsService.upsertEmailSettings(dto, admin);
    }
    getSmsSettings() {
        return this.settingsService.getSmsSettings();
    }
    upsertSmsSettings(dto, admin) {
        return this.settingsService.upsertSmsSettings(dto, admin);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all email provider configurations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getEmailSettings", null);
__decorate([
    (0, common_1.Put)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update an email provider configuration' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_email_settings_dto_1.UpdateEmailSettingsDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "upsertEmailSettings", null);
__decorate([
    (0, common_1.Get)('sms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SMS provider configurations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getSmsSettings", null);
__decorate([
    (0, common_1.Put)('sms'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update an SMS provider configuration' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sms_settings_dto_1.UpdateSmsSettingsDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "upsertSmsSettings", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin/settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map