import { EmailService } from './email.service';
import { ReminderService } from './reminder.service';
import { NotificationService } from './notification.service';
import { NotificationPreferencesService } from './notification-preferences.service';
export declare class NotificationsController {
    private readonly emailService;
    private readonly reminderService;
    private readonly notificationService;
    private readonly preferencesService;
    constructor(emailService: EmailService, reminderService: ReminderService, notificationService: NotificationService, preferencesService: NotificationPreferencesService);
    sendEmail(emailData: {
        to: string;
        subject: string;
        template?: string;
        html?: string;
        data?: any;
    }, req: any): Promise<{
        message: string;
        messageId?: string;
    }>;
    getEmailHistory(req: any, page?: number, limit?: number): Promise<{
        emails: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    createReminder(reminderData: {
        title: string;
        description?: string;
        remindAt: Date;
        type: string;
    }, req: any): Promise<{
        message: string;
        reminderId: string;
    }>;
    getReminders(req: any, status?: string, page?: number, limit?: number): Promise<{
        reminders: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateReminder(id: string, updateData: {
        status: string;
        completedAt?: Date;
    }, req: any): Promise<{
        message: string;
    }>;
    deleteReminder(id: string, req: any): Promise<{
        message: string;
    }>;
    getNotifications(req: any, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        notifications: any[];
        total: number;
        page: number;
        limit: number;
        unreadCount: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
        count: number;
    }>;
    deleteNotification(id: string, req: any): Promise<{
        message: string;
    }>;
    getUserNotificationStats(req: any): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
    }>;
    getPreferences(req: any): Promise<any>;
    updatePreferences(preferences: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        reminders?: boolean;
        emailJobMatches?: boolean;
        emailApplicationUpdates?: boolean;
        emailInterviews?: boolean;
        emailMessages?: boolean;
        emailSystem?: boolean;
        pushJobMatches?: boolean;
        pushApplicationUpdates?: boolean;
        pushInterviews?: boolean;
        pushMessages?: boolean;
        pushSystem?: boolean;
        smsJobMatches?: boolean;
        smsApplicationUpdates?: boolean;
        smsInterviews?: boolean;
        smsMessages?: boolean;
        smsSystem?: boolean;
    }, req: any): Promise<{
        message: string;
    }>;
    getNotificationStatistics(): Promise<{
        totalEmails: number;
        emailsToday: number;
        totalReminders: number;
        activeReminders: number;
        emailDeliveryRate: number;
    }>;
}
