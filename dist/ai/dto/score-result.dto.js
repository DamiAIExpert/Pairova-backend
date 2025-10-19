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
exports.ScoreResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ScoreResultDto {
    jobId;
    applicantId;
    score;
    breakdown;
    explanation;
    scoreDetails;
    modelVersion;
    predictionSource;
    calculatedAt;
}
exports.ScoreResultDto = ScoreResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The job ID for this score',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The applicant ID for this score',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The calculated match score between job and applicant',
        example: 85.5,
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], ScoreResultDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed breakdown of the scoring factors',
        example: {
            skillsMatch: 90,
            experienceMatch: 80,
            locationMatch: 85,
            educationMatch: 75,
        },
    }),
    __metadata("design:type", Object)
], ScoreResultDto.prototype, "breakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Explanation of why this score was given',
        example: 'High match due to strong skills alignment and relevant experience',
    }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed score breakdown and analysis',
        example: {
            skillsMatch: 90,
            experienceMatch: 80,
            locationMatch: 85,
            educationMatch: 75,
        },
    }),
    __metadata("design:type", Object)
], ScoreResultDto.prototype, "scoreDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Model version used for scoring',
        example: '1.2.0',
    }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "modelVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source of the prediction (cache, ai_microservice, etc.)',
        example: 'ai_microservice',
    }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "predictionSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the score was calculated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], ScoreResultDto.prototype, "calculatedAt", void 0);
//# sourceMappingURL=score-result.dto.js.map