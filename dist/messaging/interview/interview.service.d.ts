import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { User } from '../../users/shared/user.entity';
import { Application } from '../../jobs/entities/application.entity';
export declare class InterviewService {
    private readonly interviewRepository;
    private readonly applicationRepository;
    constructor(interviewRepository: Repository<Interview>, applicationRepository: Repository<Application>);
    schedule(dto: ScheduleInterviewDto, scheduler: User): Promise<Interview>;
    findOne(id: string): Promise<Interview>;
}
