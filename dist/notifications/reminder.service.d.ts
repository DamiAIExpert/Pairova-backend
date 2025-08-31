import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ChannelType } from '../common/enums/channel-type.enum';
import { User } from '../users/shared/user.entity';
export declare class ReminderService {
    private readonly reminderRepository;
    private readonly logger;
    constructor(reminderRepository: Repository<Reminder>);
    scheduleReminder(user: User, channel: ChannelType, subject: string, payload: Record<string, any>, scheduledAt: Date): Promise<Reminder>;
}
