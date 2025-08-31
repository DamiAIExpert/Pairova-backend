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
    locationCity;
    locationState;
    locationCountry;
    salaryMin;
    salaryMax;
    currency;
    status;
}
exports.CreateJobDto = CreateJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The title of the job.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A detailed description of the job role.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
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