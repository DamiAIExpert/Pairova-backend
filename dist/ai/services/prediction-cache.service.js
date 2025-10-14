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
var PredictionCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionCacheService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recommendation_score_entity_1 = require("../entities/recommendation-score.entity");
const ai_microservice_service_1 = require("./ai-microservice.service");
let PredictionCacheService = PredictionCacheService_1 = class PredictionCacheService {
    recommendationScoreRepository;
    aiMicroserviceService;
    logger = new common_1.Logger(PredictionCacheService_1.name);
    CACHE_DURATION_HOURS = 24;
    constructor(recommendationScoreRepository, aiMicroserviceService) {
        this.recommendationScoreRepository = recommendationScoreRepository;
        this.aiMicroserviceService = aiMicroserviceService;
    }
    async getPredictionScore(jobId, applicantId, jobApplicantData) {
        try {
            const cachedPrediction = await this.getCachedPrediction(jobId, applicantId);
            if (cachedPrediction && this.isCacheValid(cachedPrediction)) {
                this.logger.log(`Cache hit for job ${jobId} and applicant ${applicantId}`);
                return cachedPrediction;
            }
            if (!jobApplicantData) {
                throw new Error('Job applicant data is required when cache is unavailable');
            }
            this.logger.log(`Cache miss for job ${jobId} and applicant ${applicantId}, fetching from AI microservice`);
            const aiPrediction = await this.aiMicroserviceService.getPredictionScore(jobApplicantData);
            const cachedPrediction = await this.storePrediction(jobId, applicantId, aiPrediction, 'ai_microservice');
            return cachedPrediction;
        }
        catch (error) {
            this.logger.error(`Error getting prediction score: ${error.message}`);
            const cachedPrediction = await this.getCachedPrediction(jobId, applicantId);
            if (cachedPrediction) {
                this.logger.warn(`Using expired cache for job ${jobId} and applicant ${applicantId}`);
                return cachedPrediction;
            }
            throw error;
        }
    }
    async getCachedPrediction(jobId, applicantId) {
        const recommendationScore = await this.recommendationScoreRepository.findOne({
            where: {
                jobId,
                applicantId,
                isActive: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
        if (!recommendationScore) {
            return null;
        }
        return {
            score: recommendationScore.score,
            scoreDetails: recommendationScore.scoreDetails,
            modelVersion: recommendationScore.modelVersion,
            predictionSource: recommendationScore.predictionSource,
            isActive: recommendationScore.isActive,
            expiresAt: recommendationScore.expiresAt,
            createdAt: recommendationScore.createdAt,
        };
    }
    async storePrediction(jobId, applicantId, aiPrediction, source = 'ai_microservice') {
        try {
            await this.recommendationScoreRepository.update({ jobId, applicantId }, { isActive: false });
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + this.CACHE_DURATION_HOURS);
            const recommendationScore = this.recommendationScoreRepository.create({
                jobId,
                applicantId,
                score: aiPrediction.score,
                scoreDetails: aiPrediction.scoreDetails,
                modelVersion: aiPrediction.modelVersion,
                predictionSource: source,
                isActive: true,
                expiresAt,
            });
            const savedPrediction = await this.recommendationScoreRepository.save(recommendationScore);
            this.logger.log(`Stored prediction for job ${jobId} and applicant ${applicantId} with score ${aiPrediction.score}`);
            return {
                score: savedPrediction.score,
                scoreDetails: savedPrediction.scoreDetails,
                modelVersion: savedPrediction.modelVersion,
                predictionSource: savedPrediction.predictionSource,
                isActive: savedPrediction.isActive,
                expiresAt: savedPrediction.expiresAt,
                createdAt: savedPrediction.createdAt,
            };
        }
        catch (error) {
            this.logger.error(`Error storing prediction: ${error.message}`);
            throw error;
        }
    }
    isCacheValid(prediction) {
        if (!prediction.expiresAt) {
            return true;
        }
        return new Date() < prediction.expiresAt;
    }
    async getBatchPredictions(jobApplicantPairs) {
        const results = [];
        const cacheMisses = [];
        for (const pair of jobApplicantPairs) {
            const cachedPrediction = await this.getCachedPrediction(pair.jobId, pair.applicantId);
            if (cachedPrediction && this.isCacheValid(cachedPrediction)) {
                results.push(cachedPrediction);
            }
            else {
                cacheMisses.push(pair);
            }
        }
        if (cacheMisses.length > 0) {
            this.logger.log(`Fetching ${cacheMisses.length} predictions from AI microservice`);
            try {
                const aiPredictions = await this.aiMicroserviceService.getBatchPredictions(cacheMisses.map(pair => pair.data));
                for (let i = 0; i < cacheMisses.length; i++) {
                    const pair = cacheMisses[i];
                    const aiPrediction = aiPredictions[i];
                    const cachedPrediction = await this.storePrediction(pair.jobId, pair.applicantId, aiPrediction, 'ai_microservice');
                    results.push(cachedPrediction);
                }
            }
            catch (error) {
                this.logger.error(`Error fetching batch predictions: ${error.message}`);
                for (const pair of cacheMisses) {
                    const expiredCache = await this.getCachedPrediction(pair.jobId, pair.applicantId);
                    if (expiredCache) {
                        results.push(expiredCache);
                    }
                }
            }
        }
        return results;
    }
    async cleanupExpiredPredictions() {
        const result = await this.recommendationScoreRepository.update({
            expiresAt: new Date(),
            isActive: true,
        }, {
            isActive: false,
        });
        this.logger.log(`Cleaned up ${result.affected} expired predictions`);
        return result.affected || 0;
    }
    async getPredictionStats() {
        const total = await this.recommendationScoreRepository.count();
        const active = await this.recommendationScoreRepository.count({ where: { isActive: true } });
        const expired = await this.recommendationScoreRepository.count({
            where: {
                expiresAt: new Date(),
                isActive: true,
            },
        });
        return { total, active, expired };
    }
    async invalidateCache(jobId, applicantId) {
        const result = await this.recommendationScoreRepository.update({ jobId, applicantId }, { isActive: false });
        this.logger.log(`Invalidated cache for job ${jobId} and applicant ${applicantId}`);
        return (result.affected || 0) > 0;
    }
};
exports.PredictionCacheService = PredictionCacheService;
exports.PredictionCacheService = PredictionCacheService = PredictionCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recommendation_score_entity_1.RecommendationScore)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ai_microservice_service_1.AiMicroserviceService])
], PredictionCacheService);
//# sourceMappingURL=prediction-cache.service.js.map