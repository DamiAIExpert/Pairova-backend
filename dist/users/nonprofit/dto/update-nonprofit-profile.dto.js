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
exports.UpdateNonprofitProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateNonprofitProfileDto {
    orgName;
    firstName;
    lastName;
    logoUrl;
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
    bio;
    position;
    registrationNumber;
    requiredSkills;
    socialMediaLinks;
    certificateUrl;
}
exports.UpdateNonprofitProfileDto = UpdateNonprofitProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Organization's name", example: 'Pairova Foundation', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name of primary contact person', example: 'John', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name of primary contact person', example: 'Doe', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to the organization logo', example: 'https://cdn.pairova.com/logo.png', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Official website URL', example: 'https://pairova.org', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The mission statement of the organization', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(20, 1000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "mission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The core values of the organization', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(20, 1000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company size category', example: '50-100 employees', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "sizeLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of organization', example: 'Non-Governmental Organization', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "orgType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Industry sector', example: 'Social Services', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date the organization was founded (YYYY-MM-DD)', example: '2020-01-15', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateNonprofitProfileDto.prototype, "foundedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax identification number', example: 'AB-123456789', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country where the organization is based', example: 'Nigeria', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State or province', example: 'Abuja', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', example: 'Garki', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Street address line 1', example: '123 Main Street', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Street address line 2', example: 'Suite 100', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization description/bio', example: 'We are a nonprofit dedicated to...', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(50, 2000, { message: 'Bio must be between 50 and 2000 characters' }),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Position/role of contact person', example: 'Executive Director', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Official registration/incorporation number', example: 'REG-12345', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Skills the organization is looking for (can be array or object with softSkills/hardSkills)',
        example: { softSkills: ['Communication', 'Leadership'], hardSkills: ['Project Management', 'Grant Writing'] },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNonprofitProfileDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Social media profile URLs',
        example: { linkedin: 'https://linkedin.com/company/org', twitter: 'https://twitter.com/org', facebook: 'https://facebook.com/org' },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateNonprofitProfileDto.prototype, "socialMediaLinks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to organization certificate of registration/operation', example: 'https://cdn.pairova.com/certificates/cert.pdf', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNonprofitProfileDto.prototype, "certificateUrl", void 0);
//# sourceMappingURL=update-nonprofit-profile.dto.js.map