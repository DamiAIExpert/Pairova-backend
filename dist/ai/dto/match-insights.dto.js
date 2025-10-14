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
exports.CandidateMatchDto = exports.JobRecommendationsDto = exports.JobRecommendationDto = exports.MatchInsightsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MatchInsightsDto {
    applicantId;
    totalJobsAnalyzed;
    averageMatchScore;
    topIndustries;
    skillsAnalysis;
    locationInsights;
    experienceInsights;
    salaryInsights;
    careerRecommendations;
    marketTrends;
}
exports.MatchInsightsDto = MatchInsightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    __metadata("design:type", String)
], MatchInsightsDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total jobs analyzed' }),
    __metadata("design:type", Number)
], MatchInsightsDto.prototype, "totalJobsAnalyzed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average match score' }),
    __metadata("design:type", Number)
], MatchInsightsDto.prototype, "averageMatchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top matching industries' }),
    __metadata("design:type", Array)
], MatchInsightsDto.prototype, "topIndustries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Skills analysis' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "skillsAnalysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location preferences' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "locationInsights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Experience level insights' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "experienceInsights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salary expectations analysis' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "salaryInsights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Career progression recommendations' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "careerRecommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Market trends relevant to the applicant' }),
    __metadata("design:type", Object)
], MatchInsightsDto.prototype, "marketTrends", void 0);
class JobRecommendationDto {
    jobId;
    title;
    orgName;
    matchScore;
    reasoning;
    matchingFactors;
    concerns;
    location;
    employmentType;
    salaryRange;
    postedAt;
}
exports.JobRecommendationDto = JobRecommendationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title' }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score (0-100)' }),
    __metadata("design:type", Number)
], JobRecommendationDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Why this job is recommended' }),
    __metadata("design:type", Array)
], JobRecommendationDto.prototype, "reasoning", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key matching factors' }),
    __metadata("design:type", Object)
], JobRecommendationDto.prototype, "matchingFactors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Potential concerns or gaps' }),
    __metadata("design:type", Array)
], JobRecommendationDto.prototype, "concerns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job location' }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type' }),
    __metadata("design:type", String)
], JobRecommendationDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salary range', required: false }),
    __metadata("design:type", Object)
], JobRecommendationDto.prototype, "salaryRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date posted' }),
    __metadata("design:type", Date)
], JobRecommendationDto.prototype, "postedAt", void 0);
class JobRecommendationsDto {
    applicantId;
    recommendations;
    total;
    algorithm;
    generatedAt;
    personalizationLevel;
}
exports.JobRecommendationsDto = JobRecommendationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    __metadata("design:type", String)
], JobRecommendationsDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of recommended jobs', type: [JobRecommendationDto] }),
    __metadata("design:type", Array)
], JobRecommendationsDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total recommendations found' }),
    __metadata("design:type", Number)
], JobRecommendationsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Algorithm used for recommendations' }),
    __metadata("design:type", String)
], JobRecommendationsDto.prototype, "algorithm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of recommendation generation' }),
    __metadata("design:type", Date)
], JobRecommendationsDto.prototype, "generatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Personalization level' }),
    __metadata("design:type", String)
], JobRecommendationsDto.prototype, "personalizationLevel", void 0);
class CandidateMatchDto {
    applicantId;
    name;
    matchScore;
    strengths;
    concerns;
    yearsOfExperience;
    location;
    skillsMatchPercentage;
    profileCompleteness;
}
exports.CandidateMatchDto = CandidateMatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    __metadata("design:type", String)
], CandidateMatchDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant name' }),
    __metadata("design:type", String)
], CandidateMatchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score (0-100)' }),
    __metadata("design:type", Number)
], CandidateMatchDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key strengths' }),
    __metadata("design:type", Array)
], CandidateMatchDto.prototype, "strengths", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Potential concerns' }),
    __metadata("design:type", Array)
], CandidateMatchDto.prototype, "concerns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Years of experience' }),
    __metadata("design:type", Number)
], CandidateMatchDto.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current location' }),
    __metadata("design:type", String)
], CandidateMatchDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Skills match percentage' }),
    __metadata("design:type", Number)
], CandidateMatchDto.prototype, "skillsMatchPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profile completeness' }),
    __metadata("design:type", Number)
], CandidateMatchDto.prototype, "profileCompleteness", void 0);
//# sourceMappingURL=match-insights.dto.js.map