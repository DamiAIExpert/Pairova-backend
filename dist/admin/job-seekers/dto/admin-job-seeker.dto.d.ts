import { Gender } from '../../../common/enums/gender.enum';
import { ApplicationStatus } from '../../../jobs/entities/application.entity';
export declare class AdminJobSeekerDto {
    id: string;
    email: string;
    isVerified: boolean;
    phone?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    firstName?: string;
    lastName?: string;
    name: string;
    gender?: Gender;
    dob?: Date;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    photoUrl?: string;
    portfolioUrl?: string;
    applicationCount: number;
    averageMatchScore?: number;
    applicationDate?: string;
    currentStatus?: ApplicationStatus;
}
export declare class AdminJobSeekerListDto {
    data: AdminJobSeekerDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class AppliedJobDto {
    id: string;
    jobId: string;
    jobTitle: string;
    orgName: string;
    status: ApplicationStatus;
    appliedAt: Date;
    matchScore?: number;
}
export declare class AppliedJobsListDto {
    data: AppliedJobDto[];
    total: number;
    page: number;
    limit: number;
}
