import { JobRecommendationDto } from './job-recommendation.dto';
export declare class JobRecommendationsDto {
    applicantId: string;
    recommendations: JobRecommendationDto[];
    totalCount: number;
    generatedAt: Date;
    metadata: {
        algorithm: string;
        version: string;
        confidence: number;
    };
}
