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
exports.CompleteOnboardingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CompleteOnboardingDto {
    orgName;
    country;
    logoUrl;
    contactEmail;
    phone;
    foundedOn;
    orgType;
    industry;
    sizeLabel;
    website;
    registrationNumber;
    addressCountry;
    state;
    city;
    addressLine1;
    addressLine2;
    postalCode;
    bio;
    missionStatement;
    values;
    requiredSkills;
    firstName;
    lastName;
    position;
    socialMediaLinks;
}
exports.CompleteOnboardingDto = CompleteOnboardingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Save the Children Foundation', description: 'Organization name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NG', description: 'Country code (ISO 3166-1 alpha-2)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Organization logo URL (after upload)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'contact@organization.org', description: 'Contact email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+234 800 000 0000', description: 'Phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2010-01-15', description: 'Date organization was founded' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "foundedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NGO', description: 'Organization type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "orgType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Social Services', description: 'Industry/sector' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '51-200', description: 'Organization size' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "sizeLabel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://www.organization.org', description: 'Website URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'REG-123456', description: 'Registration number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nigeria', description: 'Country name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "addressCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lagos', description: 'State/Province' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ikeja', description: 'City' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street', description: 'Street address line 1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Suite 456', description: 'Street address line 2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '100001', description: 'Postal/ZIP code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'We are a leading organization dedicated to improving lives...',
        description: 'Organization bio (max 150 words)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Our mission is to empower communities through education and healthcare...',
        description: 'Mission statement (max 150 words)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "missionStatement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Integrity, Compassion, Excellence, Accountability...',
        description: 'Organizational values (max 150 words)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Project Management', 'Community Outreach', 'Fundraising'],
        description: 'Skills required for volunteers/positions'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CompleteOnboardingDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe', description: 'Contact person first name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Smith', description: 'Contact person last name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Executive Director', description: 'Contact person position' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteOnboardingDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { twitter: 'https://twitter.com/org', facebook: 'https://facebook.com/org' },
        description: 'Social media links'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CompleteOnboardingDto.prototype, "socialMediaLinks", void 0);
//# sourceMappingURL=complete-onboarding.dto.js.map