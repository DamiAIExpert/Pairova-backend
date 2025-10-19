import { User } from '../shared/user.entity';
import { JobsService } from '../../jobs/jobs.service';
import { CreateJobDto } from '../../jobs/dto/create-job.dto';
export declare class NgoJobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    getMyJobs(user: User, status?: string, page?: number, limit?: number): Promise<{
        jobs: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    createJob(user: User, createJobDto: CreateJobDto): Promise<any>;
    getJob(user: User, id: string): Promise<any>;
    updateJob(user: User, id: string, updateJobDto: any): Promise<any>;
    deleteJob(user: User, id: string): Promise<{
        message: string;
    }>;
    getJobApplicants(user: User, jobId: string, status?: string, page?: number, limit?: number): Promise<{
        applicants: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateApplicationStatus(user: User, jobId: string, applicantId: string, status: string, notes?: string): Promise<{
        message: string;
    }>;
    getJobStatistics(user: User): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalApplications: number;
        pendingApplications: number;
        hiredCount: number;
        rejectedCount: number;
    }>;
    getDashboard(user: User): Promise<{
        recentJobs: any[];
        recentApplications: any[];
        statistics: any;
        notifications: any[];
    }>;
}
