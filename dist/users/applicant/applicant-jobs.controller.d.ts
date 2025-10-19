import { User } from '../shared/user.entity';
import { JobsService } from '../../jobs/jobs.service';
import { JobSearchService } from '../../jobs/job-search/job-search.service';
import { ApplicationsService } from '../../jobs/job-application/application.service';
import { CreateApplicationDto } from '../../jobs/dto/create-application.dto';
import { NotificationService } from '../../notifications/notification.service';
export declare class ApplicantJobsController {
    private readonly jobsService;
    private readonly jobSearchService;
    private readonly applicationsService;
    private readonly notificationService;
    constructor(jobsService: JobsService, jobSearchService: JobSearchService, applicationsService: ApplicationsService, notificationService: NotificationService);
    searchJobs(user: User, searchParams: any): Promise<{
        jobs: any[];
        total: number;
        page: number;
        limit: number;
        filters: any;
    }>;
    getRecommendedJobs(user: User, limit?: number): Promise<{
        jobs: any[];
        total: number;
    }>;
    getSavedJobs(user: User, page?: number, limit?: number): Promise<{
        jobs: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    saveJob(user: User, jobId: string): Promise<{
        message: string;
    }>;
    unsaveJob(user: User, jobId: string): Promise<{
        message: string;
    }>;
    applyForJob(user: User, jobId: string, applicationData: CreateApplicationDto): Promise<{
        message: string;
        applicationId: string;
    }>;
    getMyApplications(user: User, status?: string, page?: number, limit?: number): Promise<{
        applications: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getApplication(user: User, id: string): Promise<any>;
    withdrawApplication(user: User, id: string): Promise<{
        message: string;
    }>;
    getDashboard(user: User): Promise<{
        recentApplications: any[];
        savedJobs: any[];
        recommendedJobs: any[];
        statistics: {
            totalApplications: number;
            pendingApplications: number;
            acceptedApplications: number;
            rejectedApplications: number;
            savedJobsCount: number;
        };
        notifications: any[];
    }>;
    getApplicationStatistics(user: User): Promise<{
        totalApplications: number;
        pendingApplications: number;
        acceptedApplications: number;
        rejectedApplications: number;
        applicationsThisMonth: number;
        averageResponseTime: number;
        successRate: number;
    }>;
}
