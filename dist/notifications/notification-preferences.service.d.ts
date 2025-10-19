import { Repository } from 'typeorm';
import { NotificationPreferences } from './entities/notification-preferences.entity';
export declare class NotificationPreferencesService {
    private readonly preferencesRepository;
    constructor(preferencesRepository: Repository<NotificationPreferences>);
    getOrCreatePreferences(userId: string): Promise<NotificationPreferences>;
    updatePreferences(userId: string, updates: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
    getPreferencesForApi(userId: string): Promise<{
        email: boolean;
        push: boolean;
        sms: boolean;
        reminders: boolean;
        emailJobMatches: boolean;
        emailApplicationUpdates: boolean;
        emailInterviews: boolean;
        emailMessages: boolean;
        emailSystem: boolean;
        pushJobMatches: boolean;
        pushApplicationUpdates: boolean;
        pushInterviews: boolean;
        pushMessages: boolean;
        pushSystem: boolean;
        smsJobMatches: boolean;
        smsApplicationUpdates: boolean;
        smsInterviews: boolean;
        smsMessages: boolean;
        smsSystem: boolean;
    }>;
}
