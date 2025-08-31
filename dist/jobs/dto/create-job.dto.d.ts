import { EmploymentType, JobPlacement, JobStatus } from '../../common/enums/job.enum';
export declare class CreateJobDto {
    title: string;
    description: string;
    placement?: JobPlacement;
    employmentType?: EmploymentType;
    experienceMinYrs?: number;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    status?: JobStatus;
}
