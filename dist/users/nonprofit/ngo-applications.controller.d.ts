import { User } from '../shared/user.entity';
import { ApplicationsService } from '../../jobs/job-application/application.service';
import { ApplicantService } from '../applicant/applicant.service';
import { ExperienceService } from '../../profiles/experience/experience.service';
import { EducationService } from '../../profiles/education/education.service';
import { CertificationService } from '../../profiles/certifications/certification.service';
import { UploadService } from '../../profiles/uploads/upload.service';
export declare class NgoApplicationsController {
    private readonly applicationsService;
    private readonly applicantService;
    private readonly experienceService;
    private readonly educationService;
    private readonly certificationService;
    private readonly uploadService;
    constructor(applicationsService: ApplicationsService, applicantService: ApplicantService, experienceService: ExperienceService, educationService: EducationService, certificationService: CertificationService, uploadService: UploadService);
    getMyApplications(user: User, status?: string, jobId?: string, pageParam?: string, limitParam?: string): Promise<{
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
    getApplicantProfile(user: User, applicantId: string): Promise<{
        profile: any;
        experiences: any[];
        educations: any[];
        certifications: any[];
        attachments: any[];
    }>;
}
