import { AiService } from './ai.service';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { ScoreResultDto } from './dto/score-result.dto';
import { JobRecommendationsDto } from './dto/job-recommendations.dto';
import { MatchInsightsDto } from './dto/match-insights.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    calculateScore(calculateScoreDto: CalculateScoreDto): Promise<ScoreResultDto>;
    getRecommendations(applicantId: string, req: any, limit?: number): Promise<JobRecommendationsDto>;
    getMatchInsights(applicantId: string, req: any): Promise<MatchInsightsDto>;
    getTopCandidates(jobId: string, limit?: number): Promise<any[]>;
    getAiServiceStatus(): Promise<any>;
    cleanupExpiredPredictions(): Promise<{
        cleaned: number;
    }>;
}
