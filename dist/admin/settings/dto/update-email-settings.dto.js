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
exports.UpdateEmailSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const provider_type_enum_1 = require("../../../common/enums/provider-type.enum");
class UpdateEmailSettingsDto {
    provider;
    smtpHost;
    smtpPort;
    username;
    password;
    fromAddress;
    secureTls;
    testingMode;
}
exports.UpdateEmailSettingsDto = UpdateEmailSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: provider_type_enum_1.ProviderType, description: 'The email provider type', default: provider_type_enum_1.ProviderType.SMTP }),
    (0, class_validator_1.IsEnum)(provider_type_enum_1.ProviderType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmailSettingsDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMTP server host', example: 'smtp.example.com', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmailSettingsDto.prototype, "smtpHost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMTP server port', example: 587, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmailSettingsDto.prototype, "smtpPort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMTP username', example: 'user@example.com', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmailSettingsDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMTP password or API key', example: 'supersecret', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmailSettingsDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The "From" address for outgoing emails', example: 'Pairova <noreply@pairova.com>' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateEmailSettingsDto.prototype, "fromAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to use a secure TLS connection', example: true, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEmailSettingsDto.prototype, "secureTls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Enable testing mode (prevents actual sending)', example: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEmailSettingsDto.prototype, "testingMode", void 0);
//# sourceMappingURL=update-email-settings.dto.js.map