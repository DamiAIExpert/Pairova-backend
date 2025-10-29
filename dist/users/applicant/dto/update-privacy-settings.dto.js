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
exports.UpdatePrivacySettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePrivacySettingsDto {
    allowAiTraining;
    allowProfileIndexing;
    allowDataAnalytics;
    allowThirdPartySharing;
}
exports.UpdatePrivacySettingsDto = UpdatePrivacySettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be used for AI model training and improvement',
        example: true,
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacySettingsDto.prototype, "allowAiTraining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow profile to be indexed and shown in search results',
        example: true,
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacySettingsDto.prototype, "allowProfileIndexing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be used for analytics and insights',
        example: true,
        required: false,
        default: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacySettingsDto.prototype, "allowDataAnalytics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be shared with third-party partners',
        example: false,
        required: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacySettingsDto.prototype, "allowThirdPartySharing", void 0);
//# sourceMappingURL=update-privacy-settings.dto.js.map