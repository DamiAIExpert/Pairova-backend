import { User } from '../../users/shared/user.entity';
import { Job } from './job.entity';
export declare class SavedJob {
    id: string;
    userId: string;
    jobId: string;
    createdAt: Date;
    user: User;
    job: Job;
}
