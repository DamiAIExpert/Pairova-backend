export declare class ScoreResultDto {
    jobId: string;
    applicantId: string;
    score: number;
    breakdown: {
        skillsMatch: number;
        experienceMatch: number;
        locationMatch: number;
        educationMatch: number;
    };
    explanation: string;
    scoreDetails: any;
    modelVersion: string;
    predictionSource: string;
    calculatedAt: Date;
}
