import { Repository } from 'typeorm';
import { SavedJob } from '../entities/saved-job.entity';
import { Job } from '../entities/job.entity';
export declare class SavedJobsService {
    private readonly savedJobsRepository;
    private readonly jobsRepository;
    constructor(savedJobsRepository: Repository<SavedJob>, jobsRepository: Repository<Job>);
    saveJob(userId: string, jobId: string): Promise<SavedJob>;
    unsaveJob(userId: string, jobId: string): Promise<void>;
    getSavedJobs(userId: string, page?: number, limit?: number): Promise<{
        jobs: Job[];
        total: number;
        page: number;
        limit: number;
    }>;
    isJobSaved(userId: string, jobId: string): Promise<boolean>;
}
