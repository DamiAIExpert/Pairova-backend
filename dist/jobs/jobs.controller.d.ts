import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '../users/shared/user.entity';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(createJobDto: CreateJobDto, user: User): Promise<import("./entities/job.entity").Job>;
    findAll(): Promise<import("./entities/job.entity").Job[]>;
    getFeaturedJobs(limit?: string): Promise<import("./entities/job.entity").Job[]>;
    findOne(id: string): Promise<import("./entities/job.entity").Job>;
    publish(id: string, user: User): Promise<import("./entities/job.entity").Job>;
    close(id: string, user: User): Promise<import("./entities/job.entity").Job>;
}
