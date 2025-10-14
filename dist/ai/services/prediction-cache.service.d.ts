import { Repository } from 'typeorm';
import { RecommendationScore } from '../entities/recommendation-score.entity';
import { AiMicroserviceService, AiPredictionResponse, JobApplicantData } from './ai-microservice.service';
export interface CachedPrediction {
    score: number;
    scoreDetails: any;
    modelVersion: string;
    predictionSource: string;
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
}
export declare class PredictionCacheService {
    private readonly recommendationScoreRepository;
    private readonly aiMicroserviceService;
    private readonly logger;
    private readonly CACHE_DURATION_HOURS;
    constructor(recommendationScoreRepository: Repository<RecommendationScore>, aiMicroserviceService: AiMicroserviceService);
    getPredictionScore(jobId: string, applicantId: string, jobApplicantData?: JobApplicantData): Promise<CachedPrediction>;
    private getCachedPrediction;
    storePrediction(jobId: string, applicantId: string, aiPrediction: AiPredictionResponse, source?: string): Promise<CachedPrediction>;
    private isCacheValid;
    getBatchPredictions(jobApplicantPairs: Array<{
        jobId: string;
        applicantId: string;
        data: JobApplicantData;
    }>): Promise<CachedPrediction[]>;
    cleanupExpiredPredictions(): Promise<number>;
    getPredictionStats(): Promise<{
        total: number;
        active: number;
        expired: number;
    }>;
    invalidateCache(jobId: string, applicantId: string): Promise<boolean>;
}
