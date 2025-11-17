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
exports.CreateJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const job_enum_1 = require("../../common/enums/job.enum");
class CreateJobDto {
    title;
    description;
    placement;
    employmentType;
    experienceMinYrs;
    experienceMaxYrs;
    experienceLevel;
    requiredSkills;
    hardSoftSkills;
    qualifications;
    responsibilities;
    missionStatement;
    benefits;
    deadline;
    locationCity;
    locationState;
    locationCountry;
    postalCode;
    salaryMin;
    salaryMax;
    currency;
    status;
}
exports.CreateJobDto = CreateJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The title of the job posting. Should be clear and descriptive.',
        example: 'Senior Software Developer',
        minLength: 5,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Job title is required' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A detailed description of the job role, responsibilities, and requirements. Use markdown formatting for better readability.',
        example: 'We are looking for a Senior Software Developer to join our team...\n\n**Responsibilities:**\n- Develop and maintain web applications\n- Collaborate with cross-functional teams\n\n**Requirements:**\n- 5+ years of experience\n- Proficiency in JavaScript/TypeScript',
        minLength: 50,
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Job description is required' }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: job_enum_1.JobPlacement,
        description: 'The work placement model (e.g., Onsite, Remote).',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(job_enum_1.JobPlacement),
    __metadata("design:type", String)
], CreateJobDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: job_enum_1.EmploymentType,
        description: 'The type of employment (e.g., Full-time, Contract).',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(job_enum_1.EmploymentType),
    __metadata("design:type", String)
], CreateJobDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum years of experience required.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "experienceMinYrs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum years of experience required.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "experienceMaxYrs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Experience level (e.g., "1-3 years", "Entry Level", "Senior").',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of required skills for the job.',
        type: [String],
        required: false,
        example: ['JavaScript', 'React', 'Node.js'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of hard and soft skills required for the job.',
        type: [String],
        required: false,
        example: ['Communication', 'Problem-Solving', 'Leadership'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "hardSoftSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Qualifications required for the job (multiline text).',
        required: false,
        example: 'At least 1-3 years of experience in administration...\nA degree or diploma in Business Administration...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "qualifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Responsibilities for the job role (multiline text).',
        required: false,
        example: 'Maintain accurate records and documentation...\nAssist with fundraising activities...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mission statement for the job or organization.',
        required: false,
        example: 'Our mission is to empower communities and drive positive change...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "missionStatement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of benefits offered with the job.',
        type: [String],
        required: false,
        example: ['Health Insurance', 'Remote Work', 'Flexible Hours'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Application deadline for the job posting.',
        required: false,
        example: '2024-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The job's location city.", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "locationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The job's location state.", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "locationState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The job's location country.", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "locationCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The job's postal/zip code.", required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The minimum salary for the role.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The maximum salary for the role.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "salaryMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The currency for the salary.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: job_enum_1.JobStatus,
        description: "The initial status of the job (e.g., 'DRAFT', 'PUBLISHED').",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(job_enum_1.JobStatus),
    __metadata("design:type", String)
], CreateJobDto.prototype, "status", void 0);
//# sourceMappingURL=create-job.dto.js.map