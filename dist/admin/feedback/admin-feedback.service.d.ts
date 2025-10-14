import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from '../../users/shared/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FeedbackDto, FeedbackListDto, CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
export declare class AdminFeedbackService {
    private readonly feedbackRepository;
    private readonly userRepository;
    constructor(feedbackRepository: Repository<Feedback>, userRepository: Repository<User>);
    findAll(paginationDto: PaginationDto, filters?: {
        status?: string;
        priority?: string;
        category?: string;
        search?: string;
    }): Promise<FeedbackListDto>;
    findOne(id: string): Promise<FeedbackDto>;
    create(createFeedbackDto: CreateFeedbackDto): Promise<FeedbackDto>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<FeedbackDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStatistics(): Promise<{
        total: number;
        thisMonth: number;
        resolvedThisMonth: number;
        avgResolutionTimeHours: number;
        statusCounts: any;
        priorityCounts: any;
        categoryCounts: any;
    }>;
    private transformToDto;
}
