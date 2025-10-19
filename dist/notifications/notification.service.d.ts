import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../common/enums/notification-type.enum';
export declare class NotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createNotification(userId: string, type: NotificationType, title: string, body: string, data?: Record<string, any>): Promise<Notification>;
    getUserNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        notifications: Notification[];
        total: number;
        page: number;
        limit: number;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
        count: number;
    }>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    getUserNotificationStats(userId: string): Promise<{
        total: number;
        unread: number;
        byType: Record<NotificationType, number>;
    }>;
    createJobMatchNotification(userId: string, jobTitle: string, jobId: string): Promise<Notification>;
    createApplicationUpdateNotification(userId: string, jobTitle: string, status: string, applicationId: string): Promise<Notification>;
    createInterviewNotification(userId: string, jobTitle: string, interviewDate: Date, interviewId: string): Promise<Notification>;
}
