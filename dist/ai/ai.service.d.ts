import { Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { ApplicantProfile } from '../users/applicant/applicant.entity';
import { NonprofitOrg } from '../users/nonprofit/nonprofit.entity';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { ScoreResultDto } from './dto/score-result.dto';
import { JobRecommendationsDto } from './dto/job-recommendations.dto';
import { MatchInsightsDto } from './dto/match-insights.dto';
import { AiMicroserviceService } from './services/ai-microservice.service';
import { PredictionCacheService } from './services/prediction-cache.service';
export declare class AiService {
    private readonly userRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    private readonly applicantProfileRepository;
    private readonly nonprofitOrgRepository;
    private readonly aiMicroserviceService;
    private readonly predictionCacheService;
    private readonly logger;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>, applicantProfileRepository: Repository<ApplicantProfile>, nonprofitOrgRepository: Repository<NonprofitOrg>, aiMicroserviceService: AiMicroserviceService, predictionCacheService: PredictionCacheService);
    calculateScore(calculateScoreDto: CalculateScoreDto): Promise<ScoreResultDto>;
    getRecommendations(applicantId: string, user: User, limit?: number): Promise<JobRecommendationsDto>;
    getMatchInsights(applicantId: string, user: User): Promise<MatchInsightsDto>;
    getTopCandidates(jobId: string, limit?: number): Promise<any[]>;
    private prepareJobApplicantData;
    private updateApplicationMatchScore;
    private formatLocation;
    getAiServiceStatus(): Promise<{
        status: string;
        version: string;
        model: string;
        cache: any;
    }>;
    cleanupExpiredPredictions(): Promise<number>;
}
