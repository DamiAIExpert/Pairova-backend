import { Job } from './job.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicationStatus } from '../../common/enums/job.enum';
export { ApplicationStatus } from '../../common/enums/job.enum';
import { Upload } from '../../profiles/uploads/entities/upload.entity';
export declare class Application {
    id: string;
    jobId: string;
    job: Job;
    applicantId: string;
    applicant: User;
    status: ApplicationStatus;
    coverLetter: string | null;
    resumeUploadId: string | null;
    resume: Upload | null;
    resumeUrl: string | null;
    matchScore: number | null;
    notes: string | null;
    appliedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
