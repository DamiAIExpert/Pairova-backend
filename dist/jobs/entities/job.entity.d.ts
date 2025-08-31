import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { User } from '../../users/shared/user.entity';
import { EmploymentType, JobPlacement, JobStatus } from '../../common/enums/job.enum';
import { Application } from './application.entity';
export declare class Job {
    id: string;
    orgUserId: string;
    organization: NonprofitOrg;
    title: string;
    description: string;
    placement: JobPlacement;
    employmentType: EmploymentType;
    experienceMinYrs: number;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    status: JobStatus;
    createdBy: string;
    creator: User;
    applications: Application[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}
