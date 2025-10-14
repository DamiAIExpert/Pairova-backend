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
exports.UpdateNgoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateNgoDto {
    isVerified;
    phone;
    orgName;
    website;
    mission;
    values;
    sizeLabel;
    orgType;
    industry;
    foundedOn;
    taxId;
    country;
    state;
    city;
    addressLine1;
    addressLine2;
}
exports.UpdateNgoDto = UpdateNgoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to verify the user', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNgoDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization website', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization mission', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "mission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization values', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization size label', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "sizeLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization type', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "orgType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Industry', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Founded date (ISO string)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "foundedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address line 1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address line 2', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNgoDto.prototype, "addressLine2", void 0);
//# sourceMappingURL=update-ngo.dto.js.map