import { Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
export declare class AdminService {
    private readonly userRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>);
    getDashboardStats(): Promise<any>;
}
