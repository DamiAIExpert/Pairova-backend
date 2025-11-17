import { EmploymentType, JobPlacement, JobStatus } from '../../common/enums/job.enum';
export declare class CreateJobDto {
    title: string;
    description: string;
    placement?: JobPlacement;
    employmentType?: EmploymentType;
    experienceMinYrs?: number;
    experienceMaxYrs?: number;
    experienceLevel?: string;
    requiredSkills?: string[];
    hardSoftSkills?: string[];
    qualifications?: string;
    responsibilities?: string;
    missionStatement?: string;
    benefits?: string[];
    deadline?: string;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    postalCode?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    status?: JobStatus;
}
