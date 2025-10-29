import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { JobPlacement } from '../../../common/enums/job.enum';
import { JobStatus } from '../../../jobs/entities/job.entity';
export declare class JobSearchFiltersDto {
    search?: string;
    location?: string;
    employmentType?: EmploymentType;
    placement?: JobPlacement;
    salaryMin?: number;
    salaryMax?: number;
    experienceLevel?: string;
    ngoId?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class JobSearchResultDto {
    id: string;
    title: string;
    description: string;
    employmentType: EmploymentType;
    placement: JobPlacement;
    status: JobStatus;
    postedAt: Date;
    deadline?: Date;
    salaryRange?: {
        min: number;
        max: number;
        currency: string;
    };
    experienceLevel?: string;
    requiredSkills: string[];
    benefits?: string[];
    ngoId: string;
    orgName: string;
    orgLogoUrl?: string;
    orgLocation: string;
    orgSize?: string;
    applicantCount: number;
    daysSincePosted: number;
    isBookmarked?: boolean;
    matchScore?: number;
    applicationStatus?: string;
}
export declare class JobSearchDto {
    jobs: JobSearchResultDto[];
    total: number;
    page: number;
    limit: number;
    query: string;
    filters: JobSearchFiltersDto;
    metadata: {
        searchTime: number;
        hasMore: boolean;
        totalPages: number;
    };
}
export declare class SearchFiltersDto {
    employmentTypes: string[];
    placements: string[];
    locations: string[];
    experienceLevels: string[];
    organizations: Array<{
        id: string;
        name: string;
        location: string;
    }>;
    skills: string[];
    salaryRanges: Array<{
        label: string;
        min: number;
        max: number;
    }>;
}
export declare class NearbyJobsDto {
    latitude: number;
    longitude: number;
    radius?: number;
}
