import { InterviewService } from './interview.service';
import { User } from '../../users/shared/user.entity';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
export declare class InterviewController {
    private readonly interviewService;
    constructor(interviewService: InterviewService);
    schedule(dto: ScheduleInterviewDto, user: User): Promise<import("./entities/interview.entity").Interview>;
    findOne(id: string): Promise<import("./entities/interview.entity").Interview>;
}
