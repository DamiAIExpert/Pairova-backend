import { AdminFeedbackService } from './admin-feedback.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FeedbackDto, FeedbackListDto, CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
export declare class AdminFeedbackController {
    private readonly adminFeedbackService;
    constructor(adminFeedbackService: AdminFeedbackService);
    findAll(paginationDto: PaginationDto, status?: string, priority?: string, category?: string, search?: string): Promise<FeedbackListDto>;
    findOne(id: string): Promise<FeedbackDto>;
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
}
export declare class PublicFeedbackController {
    private readonly adminFeedbackService;
    constructor(adminFeedbackService: AdminFeedbackService);
    create(createFeedbackDto: CreateFeedbackDto): Promise<FeedbackDto>;
}
