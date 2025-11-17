import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { CreateComprehensiveApplicationDto } from '../dto/create-comprehensive-application.dto';
import { User } from '../../users/shared/user.entity';
import { JobsService } from '../jobs.service';
import { ApplicationStatus } from '../../common/enums/job.enum';
export declare class ApplicationsService {
    private readonly applicationRepository;
    private readonly jobsService;
    private readonly logger;
    constructor(applicationRepository: Repository<Application>, jobsService: JobsService);
    apply(createApplicationDto: CreateApplicationDto, currentUser: User): Promise<Application>;
    applyComprehensive(createComprehensiveDto: CreateComprehensiveApplicationDto, currentUser: User): Promise<Application>;
    findAllForUser(user: User): Promise<Application[]>;
    findOne(id: string, user: User): Promise<Application>;
    updateStatus(id: string, status: ApplicationStatus, notes: string | undefined, user: User): Promise<Application>;
    remove(id: string): Promise<void>;
    getApplicationsByOrganization(user: User, filters?: {
        status?: string;
        jobId?: string;
    }, page?: number, limit?: number): Promise<{
        applications: Application[];
        total: number;
        page: number;
        limit: number;
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
    getApplicationByOrganization(applicationId: string, user: User): Promise<Application>;
    updateApplicationStatusByOrganization(applicationId: string, user: User, updateData: {
        status: string;
        notes?: string;
        interviewDate?: Date;
        rejectionReason?: string;
    }): Promise<{
        message: string;
    }>;
    bulkUpdateApplicationStatusByOrganization(user: User, applicationIds: string[], status: string, notes?: string): Promise<{
        message: string;
        updatedCount: number;
    }>;
}
