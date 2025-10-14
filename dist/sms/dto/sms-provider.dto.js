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
exports.SmsLogResponseDto = exports.SendSmsDto = exports.SmsProviderResponseDto = exports.UpdateSmsProviderDto = exports.CreateSmsProviderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sms_provider_entity_1 = require("../entities/sms-provider.entity");
class CreateSmsProviderDto {
    providerType;
    name;
    description;
    configuration;
    isActive;
    priority;
    costPerSms;
    currency;
    supportedCountries;
    supportedFeatures;
}
exports.CreateSmsProviderDto = CreateSmsProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sms_provider_entity_1.SmsProviderType, description: 'SMS provider type' }),
    (0, class_validator_1.IsEnum)(sms_provider_entity_1.SmsProviderType),
    __metadata("design:type", String)
], CreateSmsProviderDto.prototype, "providerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSmsProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSmsProviderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider configuration' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSmsProviderDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether provider is active', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSmsProviderDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority order (lower = higher priority)', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSmsProviderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost per SMS', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSmsProviderDto.prototype, "costPerSms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSmsProviderDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supported countries' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSmsProviderDto.prototype, "supportedCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supported features' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSmsProviderDto.prototype, "supportedFeatures", void 0);
class UpdateSmsProviderDto {
    status;
    name;
    description;
    configuration;
    isActive;
    priority;
    isEnabled;
    costPerSms;
    currency;
    supportedCountries;
    supportedFeatures;
}
exports.UpdateSmsProviderDto = UpdateSmsProviderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: sms_provider_entity_1.SmsProviderStatus, description: 'Provider status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sms_provider_entity_1.SmsProviderStatus),
    __metadata("design:type", String)
], UpdateSmsProviderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSmsProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSmsProviderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider configuration' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSmsProviderDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether provider is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSmsProviderDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority order (lower = higher priority)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateSmsProviderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether provider is enabled' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSmsProviderDto.prototype, "isEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost per SMS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSmsProviderDto.prototype, "costPerSms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSmsProviderDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supported countries' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSmsProviderDto.prototype, "supportedCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supported features' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSmsProviderDto.prototype, "supportedFeatures", void 0);
class SmsProviderResponseDto {
    id;
    providerType;
    status;
    name;
    description;
    isActive;
    priority;
    isEnabled;
    costPerSms;
    currency;
    supportedCountries;
    supportedFeatures;
    lastHealthCheck;
    isHealthy;
    totalSent;
    totalDelivered;
    deliveryRate;
    totalErrors;
    lastError;
    lastUsed;
    createdAt;
    updatedAt;
}
exports.SmsProviderResponseDto = SmsProviderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider ID' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sms_provider_entity_1.SmsProviderType, description: 'Provider type' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "providerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sms_provider_entity_1.SmsProviderStatus, description: 'Provider status' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider description' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether provider is active' }),
    __metadata("design:type", Boolean)
], SmsProviderResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority order' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether provider is enabled' }),
    __metadata("design:type", Boolean)
], SmsProviderResponseDto.prototype, "isEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost per SMS' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "costPerSms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supported countries' }),
    __metadata("design:type", Array)
], SmsProviderResponseDto.prototype, "supportedCountries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supported features' }),
    __metadata("design:type", Array)
], SmsProviderResponseDto.prototype, "supportedFeatures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last health check timestamp' }),
    __metadata("design:type", Date)
], SmsProviderResponseDto.prototype, "lastHealthCheck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether provider is healthy' }),
    __metadata("design:type", Boolean)
], SmsProviderResponseDto.prototype, "isHealthy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total SMS sent' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "totalSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total SMS delivered' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "totalDelivered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery rate percentage' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "deliveryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total errors' }),
    __metadata("design:type", Number)
], SmsProviderResponseDto.prototype, "totalErrors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last error message' }),
    __metadata("design:type", String)
], SmsProviderResponseDto.prototype, "lastError", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last used timestamp' }),
    __metadata("design:type", Date)
], SmsProviderResponseDto.prototype, "lastUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], SmsProviderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], SmsProviderResponseDto.prototype, "updatedAt", void 0);
class SendSmsDto {
    recipient;
    message;
    type;
    preferredProviderId;
    campaignId;
    metadata;
}
exports.SendSmsDto = SendSmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recipient phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS message content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'SMS type', default: 'NOTIFICATION' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred provider ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "preferredProviderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campaign ID for bulk SMS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendSmsDto.prototype, "campaignId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendSmsDto.prototype, "metadata", void 0);
class SmsLogResponseDto {
    id;
    providerId;
    providerName;
    recipient;
    message;
    type;
    status;
    providerMessageId;
    cost;
    currency;
    errorMessage;
    sentAt;
    deliveredAt;
    failedAt;
    createdAt;
}
exports.SmsLogResponseDto = SmsLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Log ID' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider ID' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider name' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recipient phone number' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS message content' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SMS type' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery status' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provider message ID' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "providerMessageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost' }),
    __metadata("design:type", Number)
], SmsLogResponseDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message' }),
    __metadata("design:type", String)
], SmsLogResponseDto.prototype, "errorMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sent timestamp' }),
    __metadata("design:type", Date)
], SmsLogResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delivered timestamp' }),
    __metadata("design:type", Date)
], SmsLogResponseDto.prototype, "deliveredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Failed timestamp' }),
    __metadata("design:type", Date)
], SmsLogResponseDto.prototype, "failedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], SmsLogResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=sms-provider.dto.js.map