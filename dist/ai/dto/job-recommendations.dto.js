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
exports.JobRecommendationsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_recommendation_dto_1 = require("./job-recommendation.dto");
class JobRecommendationsDto {
    applicantId;
    recommendations;
    totalCount;
    generatedAt;
    metadata;
}
exports.JobRecommendationsDto = JobRecommendationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The applicant ID for these recommendations',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], JobRecommendationsDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of job recommendations for the applicant',
        type: [job_recommendation_dto_1.JobRecommendationDto],
    }),
    __metadata("design:type", Array)
], JobRecommendationsDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of recommendations found',
        example: 15,
    }),
    __metadata("design:type", Number)
], JobRecommendationsDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when recommendations were generated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], JobRecommendationsDto.prototype, "generatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadata about the recommendation algorithm used',
        example: {
            algorithm: 'hybrid',
            version: '1.2.0',
            confidence: 0.85,
        },
    }),
    __metadata("design:type", Object)
], JobRecommendationsDto.prototype, "metadata", void 0);
//# sourceMappingURL=job-recommendations.dto.js.map