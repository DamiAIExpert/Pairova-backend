import { ApplicationStatus } from '../../../jobs/entities/application.entity';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { JobPlacement } from '../../../common/enums/job.enum';
export declare class AdminApplicationDto {
    id: string;
    status: ApplicationStatus;
    createdAt: Date;
    updatedAt: Date;
    coverLetter?: string;
    resumeUrl?: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhotoUrl?: string;
    applicantPhone?: string;
    applicantLocation?: string;
    jobId: string;
    jobTitle: string;
    jobDescription: string;
    employmentType: EmploymentType;
    placement: JobPlacement;
    ngoId: string;
    ngoName: string;
    ngoLogoUrl?: string;
    ngoLocation?: string;
    matchScore?: number;
    daysSinceApplication: number;
}
export declare class AdminApplicationListDto {
    data: AdminApplicationDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
    notes?: string;
}
export declare class ApplicationPipelineDto {
    pending: number;
    underReview: number;
    interview: number;
    hired: number;
    denied: number;
    withdrawn: number;
    total: number;
    hiringRate: number;
    averageTimeToHire?: number;
}
export declare class ApplicationStatisticsDto {
    totalApplications: number;
    applicationsThisMonth: number;
    applicationsByStatus: Record<ApplicationStatus, number>;
    averageApplicationsPerJob: number;
    topJobs: Array<{
        jobId: string;
        jobTitle: string;
        ngoName: string;
        applicationCount: number;
    }>;
    hiringRate: number;
    averageTimeToHire?: number;
}
