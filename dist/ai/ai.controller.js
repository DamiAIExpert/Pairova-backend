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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const ai_service_1 = require("./ai.service");
const calculate_score_dto_1 = require("./dto/calculate-score.dto");
const score_result_dto_1 = require("./dto/score-result.dto");
const job_recommendations_dto_1 = require("./dto/job-recommendations.dto");
const match_insights_dto_1 = require("./dto/match-insights.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async calculateScore(calculateScoreDto) {
        return await this.aiService.calculateScore(calculateScoreDto);
    }
    async getRecommendations(applicantId, req, limit = 10) {
        return await this.aiService.getRecommendations(applicantId, req.user, limit);
    }
    async getMatchInsights(applicantId, req) {
        return await this.aiService.getMatchInsights(applicantId, req.user);
    }
    async getTopCandidates(jobId, limit = 10) {
        return await this.aiService.getTopCandidates(jobId, limit);
    }
    async getAiServiceStatus() {
        return await this.aiService.getAiServiceStatus();
    }
    async cleanupExpiredPredictions() {
        const cleaned = await this.aiService.cleanupExpiredPredictions();
        return { cleaned };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('calculate-score'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate AI match score between job and applicant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Match score calculated successfully',
        type: score_result_dto_1.ScoreResultDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job or applicant not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'AI microservice error' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_score_dto_1.CalculateScoreDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "calculateScore", null);
__decorate([
    (0, common_1.Get)('recommendations/:applicantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI-powered job recommendations for applicant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recommendations retrieved successfully',
        type: job_recommendations_dto_1.JobRecommendationsDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Applicant not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of recommendations to return' }),
    __param(0, (0, common_1.Param)('applicantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Get)('match-insights/:applicantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed match insights for applicant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Match insights retrieved successfully',
        type: match_insights_dto_1.MatchInsightsDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Applicant not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Param)('applicantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getMatchInsights", null);
__decorate([
    (0, common_1.Get)('top-candidates/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top candidates for a job based on AI scores' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Top candidates retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of candidates to return' }),
    __param(0, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getTopCandidates", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI microservice status and cache statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'AI service status retrieved successfully',
    }),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getAiServiceStatus", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Clean up expired prediction cache entries' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Expired predictions cleaned up successfully',
    }),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "cleanupExpiredPredictions", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Services'),
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map