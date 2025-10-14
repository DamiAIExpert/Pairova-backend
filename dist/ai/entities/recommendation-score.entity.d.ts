import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/shared/user.entity';
export declare class RecommendationScore {
    id: string;
    jobId: string;
    job: Job;
    applicantId: string;
    applicant: User;
    score: number;
    scoreDetails: {
        skillMatch: number;
        experienceMatch: number;
        locationMatch: number;
        salaryMatch: number;
        industryMatch: number;
        educationMatch: number;
        cultureMatch: number;
        availabilityMatch: number;
        recommendationReason: string;
        skillGaps: string[];
        strengths: string[];
        improvements: string[];
    } | null;
    modelVersion: string | null;
    predictionSource: string | null;
    isActive: boolean;
    expiresAt: Date | null;
    createdAt: Date;
}
