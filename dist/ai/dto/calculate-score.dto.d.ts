export declare class CalculateScoreDto {
    applicantId: string;
    jobId: string;
}
export declare class ScoreResultDto {
    score: number;
    breakdown: {
        skills: {
            score: number;
            matched: string[];
            missing: string[];
        };
        experience: {
            score: number;
            level: string;
            years: number;
        };
        location: {
            score: number;
            match: boolean;
            distance?: number;
        };
        preferences: {
            score: number;
            employmentType: boolean;
            placement: boolean;
        };
    };
    explanations: string[];
    recommendations: string[];
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
    calculatedAt: Date;
}
