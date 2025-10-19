import { SavedJobsService } from './saved-jobs.service';
import { User } from '../../users/shared/user.entity';
export declare class SavedJobsController {
    private readonly savedJobsService;
    constructor(savedJobsService: SavedJobsService);
    getSavedJobs(user: User, page?: number, limit?: number): Promise<{
        jobs: import("../entities/job.entity").Job[];
        total: number;
        page: number;
        limit: number;
    }>;
    saveJob(user: User, jobId: string): Promise<import("../entities/saved-job.entity").SavedJob>;
    unsaveJob(user: User, jobId: string): Promise<{
        message: string;
    }>;
    isJobSaved(user: User, jobId: string): Promise<{
        isSaved: boolean;
    }>;
}
