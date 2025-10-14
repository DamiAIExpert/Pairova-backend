import { FeedbackStatus, FeedbackPriority, FeedbackCategory } from '../entities/feedback.entity';
export declare class FeedbackDto {
    id: string;
    title: string;
    description: string;
    category: FeedbackCategory;
    status: FeedbackStatus;
    priority: FeedbackPriority;
    userEmail?: string;
    userName?: string;
    userId?: string;
    adminNotes?: string;
    assignedToId?: string;
    assignedToName?: string;
    browserInfo?: string;
    deviceInfo?: string;
    pageUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FeedbackListDto {
    data: FeedbackDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class CreateFeedbackDto {
    title: string;
    description: string;
    category: FeedbackCategory;
    userEmail?: string;
    userName?: string;
    browserInfo?: string;
    deviceInfo?: string;
    pageUrl?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateFeedbackDto {
    status?: FeedbackStatus;
    priority?: FeedbackPriority;
    adminNotes?: string;
    assignedToId?: string;
}
