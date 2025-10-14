import { User } from '../../../users/shared/user.entity';
export declare enum FeedbackStatus {
    PENDING = "PENDING",
    IN_REVIEW = "IN_REVIEW",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare enum FeedbackPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum FeedbackCategory {
    BUG_REPORT = "BUG_REPORT",
    FEATURE_REQUEST = "FEATURE_REQUEST",
    USER_EXPERIENCE = "USER_EXPERIENCE",
    PERFORMANCE = "PERFORMANCE",
    SECURITY = "SECURITY",
    GENERAL = "GENERAL"
}
export declare class Feedback {
    id: string;
    title: string;
    description: string;
    category: FeedbackCategory;
    status: FeedbackStatus;
    priority: FeedbackPriority;
    userEmail: string;
    userName: string;
    userId: string;
    user: User;
    adminNotes: string;
    assignedToId: string;
    assignedTo: User;
    browserInfo: string;
    deviceInfo: string;
    pageUrl: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
