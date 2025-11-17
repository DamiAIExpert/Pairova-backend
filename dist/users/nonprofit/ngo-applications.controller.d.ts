import { User } from '../shared/user.entity';
import { ApplicationsService } from '../../jobs/job-application/application.service';
export declare class NgoApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    getMyApplications(user: User, status?: string, jobId?: string, page?: number, limit?: number): Promise<{
        applications: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getApplication(user: User, id: string): Promise<any>;
    updateApplicationStatus(user: User, id: string, updateData: {
        status: string;
        notes?: string;
        interviewDate?: Date;
        rejectionReason?: string;
    }): Promise<{
        message: string;
    }>;
    getApplicationStatistics(user: User): Promise<{
        totalApplications: number;
        pendingApplications: number;
        reviewedApplications: number;
        shortlistedApplications: number;
        interviewedApplications: number;
        acceptedApplications: number;
        rejectedApplications: number;
        applicationsThisMonth: number;
    }>;
    getApplicationPipeline(user: User): Promise<{
        stages: Array<{
            stage: string;
            count: number;
            percentage: number;
        }>;
    }>;
    bulkUpdateApplicationStatus(user: User, updateData: {
        applicationIds: string[];
        status: string;
        notes?: string;
    }): Promise<{
        message: string;
        updatedCount: number;
    }>;
}
