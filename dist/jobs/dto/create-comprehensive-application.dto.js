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
exports.CreateComprehensiveApplicationDto = exports.CertificationEntryDto = exports.EducationEntryDto = exports.ExperienceEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ExperienceEntryDto {
    company;
    position;
    employmentType;
    startDate;
    endDate;
    currentlyWorking;
    location;
    state;
    postalCode;
    description;
}
exports.ExperienceEntryDto = ExperienceEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job position/title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currently working here', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExperienceEntryDto.prototype, "currentlyWorking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State/Province', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExperienceEntryDto.prototype, "description", void 0);
class EducationEntryDto {
    school;
    degree;
    fieldOfStudy;
    startDate;
    endDate;
    grade;
    description;
}
exports.EducationEntryDto = EducationEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School/University name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "school", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Degree', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "degree", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field of study', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "fieldOfStudy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade/GPA', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EducationEntryDto.prototype, "description", void 0);
class CertificationEntryDto {
    name;
    issuingOrganization;
    issueDate;
    credentialId;
    credentialUrl;
    fileUploadId;
}
exports.CertificationEntryDto = CertificationEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certification name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issuing organization', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "issuingOrganization", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Credential ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "credentialId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Credential URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "credentialUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certificate file upload ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CertificationEntryDto.prototype, "fileUploadId", void 0);
class CreateComprehensiveApplicationDto {
    jobId;
    coverLetter;
    resumeUploadId;
    fullName;
    email;
    phone;
    linkedinUrl;
    portfolioUrl;
    yearsOfExperience;
    currentEmployer;
    expectedSalary;
    availabilityDate;
    willingToRelocate;
    referenceContact;
    experiences;
    education;
    certifications;
    hardSkills;
    techSkills;
}
exports.CreateComprehensiveApplicationDto = CreateComprehensiveApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the job being applied for (UUID or demo ID).' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cover letter', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "coverLetter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resume upload ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "resumeUploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'LinkedIn URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Portfolio URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "portfolioUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current employer', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "currentEmployer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expected salary', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "expectedSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Availability date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "availabilityDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Willing to relocate', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateComprehensiveApplicationDto.prototype, "willingToRelocate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference contact', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComprehensiveApplicationDto.prototype, "referenceContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Experience entries',
        type: [ExperienceEntryDto],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExperienceEntryDto),
    __metadata("design:type", Array)
], CreateComprehensiveApplicationDto.prototype, "experiences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Education entries',
        type: [EducationEntryDto],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EducationEntryDto),
    __metadata("design:type", Array)
], CreateComprehensiveApplicationDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Certification entries',
        type: [CertificationEntryDto],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CertificationEntryDto),
    __metadata("design:type", Array)
], CreateComprehensiveApplicationDto.prototype, "certifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hard/Soft skills',
        type: [String],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateComprehensiveApplicationDto.prototype, "hardSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Technical skills',
        type: [String],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateComprehensiveApplicationDto.prototype, "techSkills", void 0);
//# sourceMappingURL=create-comprehensive-application.dto.js.map