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
exports.ScoreResultDto = exports.CalculateScoreDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CalculateScoreDto {
    applicantId;
    jobId;
}
exports.CalculateScoreDto = CalculateScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CalculateScoreDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CalculateScoreDto.prototype, "jobId", void 0);
class ScoreResultDto {
    score;
    breakdown;
    explanations;
    recommendations;
    confidence;
    calculatedAt;
}
exports.ScoreResultDto = ScoreResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Overall compatibility score (0-100)' }),
    __metadata("design:type", Number)
], ScoreResultDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Score breakdown by category' }),
    __metadata("design:type", Object)
], ScoreResultDto.prototype, "breakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed explanations for the score' }),
    __metadata("design:type", Array)
], ScoreResultDto.prototype, "explanations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendations for improvement' }),
    __metadata("design:type", Array)
], ScoreResultDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Confidence level of the match' }),
    __metadata("design:type", String)
], ScoreResultDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of calculation' }),
    __metadata("design:type", Date)
], ScoreResultDto.prototype, "calculatedAt", void 0);
//# sourceMappingURL=calculate-score.dto.js.map