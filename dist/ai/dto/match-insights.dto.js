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
exports.MatchInsightsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MatchInsightsDto {
    applicantId;
    totalApplications;
    totalJobsAnalyzed;
    averageMatchScore;
    topSkills;
    skillGaps;
    topIndustries;
    industryPreferences;
    locationPreferences;
    salaryExpectations;
    skillsAnalysis;
    locationInsights;
    marketTrends;
    improvementSuggestions;
    generatedAt;
}
exports.MatchInsightsDto = MatchInsightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The applicant ID for these insights',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], MatchInsightsDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of applications analyzed',
        example: 25,
    }),
    __metadata("design:type", Number)
], MatchInsightsDto.prototype, "totalApplications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of jobs analyzed',
        example: 150,
    }),
    __metadata("design:type", Number)
], MatchInsightsDto.prototype, "totalJobsAnalyzed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average match score across all applications',
        example: 78.5,
    }),
    __metadata("design:type", Number)
], MatchInsightsDto.prototype, "averageMatchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top skills identified',
        example: ['JavaScript', 'React', 'Node.js'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "topSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Skill gaps identified',
        example: ['TypeScript', 'AWS'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "skillGaps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top industries the applicant has applied to',
        example: ['Technology', 'Healthcare', 'Education'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "topIndustries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Industry preferences based on applications',
        example: ['Technology', 'Healthcare'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "industryPreferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location preferences based on applications',
        example: ['San Francisco', 'New York', 'Remote'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "locationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Salary expectations analysis',
        example: {
            min: 80000,
            max: 120000,
            currency: 'USD',
        },
    }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "salaryExpectations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Skills analysis details',
        example: {
            strengths: ['JavaScript', 'React'],
            weaknesses: ['TypeScript', 'AWS'],
            recommendations: ['Learn TypeScript', 'Get AWS certification'],
        },
    }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "skillsAnalysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location insights',
        example: {
            preferredCities: ['San Francisco', 'New York'],
            remoteWorkPreference: 0.8,
        },
    }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "locationInsights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Market trends analysis',
        example: {
            demandTrend: 'increasing',
            salaryTrend: 'stable',
            skillDemand: ['React', 'Node.js', 'TypeScript'],
        },
    }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "marketTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Improvement suggestions',
        example: ['Learn TypeScript', 'Get AWS certification', 'Improve soft skills'],
    }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "improvementSuggestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when insights were generated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], MatchInsightsDto.prototype, "generatedAt", void 0);
//# sourceMappingURL=match-insights.dto.js.map