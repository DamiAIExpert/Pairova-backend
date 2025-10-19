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
exports.JobRecommendationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class JobRecommendationDto {
    jobId;
    title;
    description;
    orgName;
    location;
    employmentType;
    matchScore;
    reason;
    postedAt;
    deadline;
    salary;
}
exports.JobRecommendationDto = JobRecommendationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the job',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job title',
        example: 'Senior Software Developer',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job description',
        example: 'We are looking for a senior software developer...',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Organization name that posted the job',
        example: 'Tech for Good Foundation',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job location',
        example: 'San Francisco, CA',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employment type',
        example: 'FULL_TIME',
        enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP'],
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Match score for this recommendation',
        example: 87.5,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], JobRecommendationDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Why this job was recommended',
        example: 'Strong match based on your Python and React skills',
    }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job posting date',
        example: '2024-01-10T09:00:00Z',
    }),
    __metadata("design:type", Date)
], JobRecommendationDto.prototype, "postedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Application deadline',
        example: '2024-02-15T23:59:59Z',
        nullable: true,
    }),
    __metadata("design:type", Date)
], JobRecommendationDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Salary range if available',
        example: {
            min: 80000,
            max: 120000,
            currency: 'USD',
        },
        nullable: true,
    }),
    __metadata("design:type", Object)
], JobRecommendationDto.prototype, "salary", void 0);
//# sourceMappingURL=job-recommendation.dto.js.map