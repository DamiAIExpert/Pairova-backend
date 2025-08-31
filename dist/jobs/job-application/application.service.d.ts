import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { User } from '../../users/shared/user.entity';
import { JobsService } from '../jobs.service';
export declare class ApplicationsService {
    private readonly applicationRepository;
    private readonly jobsService;
    constructor(applicationRepository: Repository<Application>, jobsService: JobsService);
    apply(createApplicationDto: CreateApplicationDto, currentUser: User): Promise<Application>;
    findAllForUser(user: User): Promise<Application[]>;
    findOne(id: string, user: User): Promise<Application>;
}
