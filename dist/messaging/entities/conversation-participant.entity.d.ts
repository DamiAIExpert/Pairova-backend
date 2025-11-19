import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';
export declare class ConversationParticipant {
    id: string;
    conversationId: string;
    userId: string;
    conversation: Conversation;
    user: User;
    lastSeenAt: Date;
    role: string;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
