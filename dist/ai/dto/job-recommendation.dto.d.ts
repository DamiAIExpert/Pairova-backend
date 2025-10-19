export declare class JobRecommendationDto {
    jobId: string;
    title: string;
    description: string;
    orgName: string;
    location: string;
    employmentType: string;
    matchScore: number;
    reason: string;
    postedAt: Date;
    deadline?: Date;
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
}
