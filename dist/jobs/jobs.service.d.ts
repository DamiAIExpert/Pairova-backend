import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '../users/shared/user.entity';
export declare class JobsService {
    private readonly jobsRepository;
    constructor(jobsRepository: Repository<Job>);
    create(createJobDto: CreateJobDto, currentUser: User): Promise<Job>;
    findAllPublished(): Promise<Job[]>;
    findOne(id: string): Promise<Job>;
    publish(id: string, currentUser: User): Promise<Job>;
    close(id: string, currentUser: User): Promise<Job>;
    getFeaturedJobs(limit?: number): Promise<Job[]>;
}
