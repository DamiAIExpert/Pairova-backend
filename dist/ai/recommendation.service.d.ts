import { ScoringService } from './scoring.service.js';
export declare class RecommendationService {
    private readonly scoring;
    constructor(scoring: ScoringService);
    recommend(job: any, profile: any): {
        score: number;
        explanation: string[];
    };
}
