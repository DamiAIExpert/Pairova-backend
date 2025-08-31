import { User } from '../../users/shared/user.entity';
import { ChannelType } from '../../common/enums/channel-type.enum';
export declare class Reminder {
    id: string;
    userId: string;
    user: User;
    channel: ChannelType;
    subject: string;
    payload: Record<string, any>;
    scheduledAt: Date;
    sentAt: Date | null;
    createdAt: Date;
}
