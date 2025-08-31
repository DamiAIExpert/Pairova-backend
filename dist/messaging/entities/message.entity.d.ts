import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';
import { MessageType } from '../../common/enums/message.enum';
import { Upload } from '../../profiles/uploads/entities/upload.entity';
export declare class Message {
    id: string;
    conversationId: string;
    conversation: Conversation;
    senderId: string;
    sender: User;
    type: MessageType;
    content: string | null;
    attachmentId: string | null;
    attachment?: Upload | null;
    sentAt: Date;
    isDeleted: boolean;
}
