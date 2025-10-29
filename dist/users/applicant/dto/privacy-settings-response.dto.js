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
exports.PrivacySettingsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PrivacySettingsResponseDto {
    allowAiTraining;
    allowProfileIndexing;
    allowDataAnalytics;
    allowThirdPartySharing;
    privacyUpdatedAt;
    userId;
}
exports.PrivacySettingsResponseDto = PrivacySettingsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be used for AI model training and improvement',
        example: true
    }),
    __metadata("design:type", Boolean)
], PrivacySettingsResponseDto.prototype, "allowAiTraining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow profile to be indexed and shown in search results',
        example: true
    }),
    __metadata("design:type", Boolean)
], PrivacySettingsResponseDto.prototype, "allowProfileIndexing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be used for analytics and insights',
        example: true
    }),
    __metadata("design:type", Boolean)
], PrivacySettingsResponseDto.prototype, "allowDataAnalytics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allow data to be shared with third-party partners',
        example: false
    }),
    __metadata("design:type", Boolean)
], PrivacySettingsResponseDto.prototype, "allowThirdPartySharing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the last privacy settings update',
        example: '2024-01-15T10:30:00Z',
        nullable: true
    }),
    __metadata("design:type", Date)
], PrivacySettingsResponseDto.prototype, "privacyUpdatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], PrivacySettingsResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=privacy-settings-response.dto.js.map