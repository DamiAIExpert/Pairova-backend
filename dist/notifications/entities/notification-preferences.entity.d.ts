import { User } from '../../users/shared/user.entity';
export declare class NotificationPreferences {
    id: string;
    userId: string;
    user: User;
    emailEnabled: boolean;
    emailJobMatches: boolean;
    emailApplicationUpdates: boolean;
    emailInterviews: boolean;
    emailMessages: boolean;
    emailSystem: boolean;
    pushEnabled: boolean;
    pushJobMatches: boolean;
    pushApplicationUpdates: boolean;
    pushInterviews: boolean;
    pushMessages: boolean;
    pushSystem: boolean;
    smsEnabled: boolean;
    smsJobMatches: boolean;
    smsApplicationUpdates: boolean;
    smsInterviews: boolean;
    smsMessages: boolean;
    smsSystem: boolean;
    remindersEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
