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
exports.UpdateSmsSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sms_provider_enum_1 = require("../../../common/enums/sms-provider.enum");
const sms_status_enum_1 = require("../../../common/enums/sms-status.enum");
class UpdateSmsSettingsDto {
    provider;
    apiKey;
    senderId;
    country;
    status;
}
exports.UpdateSmsSettingsDto = UpdateSmsSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sms_provider_enum_1.SmsProvider, description: 'The SMS provider' }),
    (0, class_validator_1.IsEnum)(sms_provider_enum_1.SmsProvider),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSmsSettingsDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'API Key for the SMS provider' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSmsSettingsDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sender ID (e.g., a short code or brand name)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSmsSettingsDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary country for this provider', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSmsSettingsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sms_status_enum_1.SmsStatus, description: 'The status of this provider configuration' }),
    (0, class_validator_1.IsEnum)(sms_status_enum_1.SmsStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSmsSettingsDto.prototype, "status", void 0);
//# sourceMappingURL=update-sms-settings.dto.js.map