import { ConversationType, ConversationStatus } from '../entities/conversation.entity';
import { MessageType } from '../entities/message.entity';
import { MessageStatusType } from '../entities/message-status.entity';
export declare class CreateConversationDto {
    type: ConversationType;
    title?: string;
    description?: string;
    jobId?: string;
    participantIds: string[];
    applicationId?: string;
    interviewId?: string;
    metadata?: {
        tags?: string[];
        priority?: 'LOW' | 'MEDIUM' | 'HIGH';
        category?: string;
    };
}
export declare class UpdateConversationDto {
    title?: string;
    description?: string;
    status?: ConversationStatus;
    isArchived?: boolean;
    metadata?: {
        tags?: string[];
        priority?: 'LOW' | 'MEDIUM' | 'HIGH';
        category?: string;
    };
}
export declare class SendMessageDto {
    conversationId: string;
    content?: string;
    type?: MessageType;
    attachmentId?: string;
    replyToId?: string;
    metadata?: {
        isUrgent?: boolean;
        requiresResponse?: boolean;
        expiresAt?: Date;
    };
}
export declare class MessageResponseDto {
    id: string;
    conversationId: string;
    senderId: string;
    sender: {
        id: string;
        email: string;
        role: string;
        profile?: {
            firstName?: string;
            lastName?: string;
            orgName?: string;
        };
    };
    type: MessageType;
    content?: string;
    attachment?: {
        id: string;
        filename: string;
        url: string;
        size: number;
        mimeType: string;
    };
    replyTo?: {
        id: string;
        content: string;
        sender: {
            firstName?: string;
            lastName?: string;
            orgName?: string;
        };
    };
    status: MessageStatusType;
    sentAt: Date;
    isDeleted: boolean;
    metadata?: any;
}
export declare class ConversationResponseDto {
    id: string;
    type: ConversationType;
    status: ConversationStatus;
    title?: string;
    description?: string;
    job?: {
        id: string;
        title: string;
        orgName: string;
    };
    participants: Array<{
        id: string;
        email: string;
        role: string;
        joinedAt: Date;
        lastSeenAt?: Date;
        profile?: {
            firstName?: string;
            lastName?: string;
            orgName?: string;
            photoUrl?: string;
        };
    }>;
    lastMessage?: MessageResponseDto;
    lastMessageAt?: Date;
    unreadCount: number;
    createdAt: Date;
    metadata?: any;
}
export declare class MessageStatusUpdateDto {
    status: MessageStatusType;
    messageId: string;
}
export declare class ConversationSearchDto {
    query?: string;
    type?: ConversationType;
    jobId?: string;
    participantId?: string;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
}
