export declare class MatchInsightsDto {
    applicantId: string;
    totalJobsAnalyzed: number;
    averageMatchScore: number;
    topIndustries: Array<{
        industry: string;
        averageScore: number;
        jobCount: number;
    }>;
    skillsAnalysis: {
        strongSkills: string[];
        missingSkills: string[];
        skillGaps: Array<{
            skill: string;
            demand: number;
            currentLevel: number;
        }>;
    };
    locationInsights: {
        preferredLocations: string[];
        remoteWorkPreference: boolean;
        locationScoreDistribution: Array<{
            location: string;
            averageScore: number;
        }>;
    };
    experienceInsights: {
        currentLevel: string;
        targetLevel: string;
        yearsOfExperience: number;
        recommendedLevel: string;
    };
    salaryInsights: {
        expectedRange: {
            min: number;
            max: number;
            currency: string;
        };
        marketAverage: number;
        recommendation: string;
    };
    careerRecommendations: {
        nextSteps: string[];
        skillDevelopment: string[];
        experienceGaps: string[];
        networkingOpportunities: string[];
    };
    marketTrends: {
        growingSkills: string[];
        decliningSkills: string[];
        emergingOpportunities: string[];
        salaryTrends: string;
    };
}
export declare class JobRecommendationDto {
    jobId: string;
    title: string;
    orgName: string;
    matchScore: number;
    reasoning: string[];
    matchingFactors: {
        skills: string[];
        location: boolean;
        experience: boolean;
        preferences: boolean;
    };
    concerns: string[];
    location: string;
    employmentType: string;
    salaryRange?: {
        min: number;
        max: number;
        currency: string;
    };
    postedAt: Date;
}
export declare class JobRecommendationsDto {
    applicantId: string;
    recommendations: JobRecommendationDto[];
    total: number;
    algorithm: string;
    generatedAt: Date;
    personalizationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
export declare class CandidateMatchDto {
    applicantId: string;
    name: string;
    matchScore: number;
    strengths: string[];
    concerns: string[];
    yearsOfExperience: number;
    location: string;
    skillsMatchPercentage: number;
    profileCompleteness: number;
}
