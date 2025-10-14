import { Message } from './message.entity';
import { User } from '../../users/shared/user.entity';
export declare enum MessageStatusType {
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED"
}
export declare class MessageStatus {
    id: string;
    messageId: string;
    message: Message;
    userId: string;
    user: User;
    status: MessageStatusType;
    createdAt: Date;
    updatedAt: Date | null;
}
