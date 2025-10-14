import { JobStatus } from '../../../jobs/entities/job.entity';
import { ApplicationStatus } from '../../../jobs/entities/application.entity';
export declare class AdminNgoDto {
    id: string;
    email: string;
    isVerified: boolean;
    phone?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    orgName: string;
    logoUrl?: string;
    website?: string;
    mission?: string;
    values?: string;
    sizeLabel?: string;
    orgType?: string;
    industry?: string;
    foundedOn?: Date;
    taxId?: string;
    country?: string;
    state?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    jobCount: number;
    applicationCount: number;
    activeJobCount: number;
}
export declare class AdminNgoListDto {
    data: AdminNgoDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class NgoJobDto {
    id: string;
    title: string;
    description: string;
    employmentType: string;
    placement: string;
    status: JobStatus;
    postedAt: Date;
    applicationCount: number;
}
export declare class NgoJobsListDto {
    data: NgoJobDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class JobApplicantDto {
    applicationId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    status: ApplicationStatus;
    appliedAt: Date;
    matchScore?: number;
    photoUrl?: string;
}
export declare class JobApplicantsListDto {
    data: JobApplicantDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class NgoStatisticsDto {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    applicationsByStatus: Record<ApplicationStatus, number>;
    jobsByStatus: Record<JobStatus, number>;
    averageApplicationsPerJob: number;
    hiringRate: number;
}
