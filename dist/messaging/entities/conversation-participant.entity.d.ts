import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';
export declare class ConversationParticipant {
    conversationId: string;
    userId: string;
    conversation: Conversation;
    user: User;
    lastReadAt: Date;
    lastSeenAt: Date;
    role: string;
    joinedAt: Date;
}
