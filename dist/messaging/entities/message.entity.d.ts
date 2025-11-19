import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';
import { MessageType } from '../../common/enums/message.enum';
export { MessageType } from '../../common/enums/message.enum';
export declare class Message {
    id: string;
    conversationId: string;
    conversation: Conversation;
    senderId: string;
    sender: User;
    type: MessageType;
    content: string | null;
    attachmentId: string | null;
    sentAt: Date;
    replyToId: string | null;
    replyTo: Message | null;
    metadata: any;
}
