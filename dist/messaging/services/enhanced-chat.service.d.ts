import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { ConversationParticipant } from '../entities/conversation-participant.entity';
import { MessageStatus, MessageStatusType } from '../entities/message-status.entity';
import { User } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Upload } from '../../profiles/uploads/entities/upload.entity';
import { CreateConversationDto, SendMessageDto, ConversationResponseDto, MessageResponseDto, ConversationSearchDto } from '../dto/chat.dto';
export declare class EnhancedChatService {
    private readonly messageRepository;
    private readonly conversationRepository;
    private readonly participantRepository;
    private readonly messageStatusRepository;
    private readonly userRepository;
    private readonly jobRepository;
    private readonly uploadRepository;
    private readonly logger;
    constructor(messageRepository: Repository<Message>, conversationRepository: Repository<Conversation>, participantRepository: Repository<ConversationParticipant>, messageStatusRepository: Repository<MessageStatus>, userRepository: Repository<User>, jobRepository: Repository<Job>, uploadRepository: Repository<Upload>);
    createConversation(createConversationDto: CreateConversationDto, creator: User): Promise<ConversationResponseDto>;
    getUserConversations(userId: string, searchDto?: ConversationSearchDto): Promise<{
        conversations: ConversationResponseDto[];
        total: number;
    }>;
    sendMessage(sendMessageDto: SendMessageDto, sender: User): Promise<MessageResponseDto>;
    getConversationMessages(conversationId: string, userId: string, page?: number, limit?: number): Promise<{
        messages: MessageResponseDto[];
        total: number;
    }>;
    markMessagesAsRead(messageIds: string[], userId: string): Promise<void>;
    updateMessageStatus(messageId: string, userId: string, status: MessageStatusType): Promise<void>;
    addParticipant(conversationId: string, userId: string, addedBy: User): Promise<void>;
    removeParticipant(conversationId: string, userId: string, removedBy: User): Promise<void>;
    archiveConversation(conversationId: string, userId: string, isArchived: boolean): Promise<void>;
    getConversation(conversationId: string, userId: string): Promise<ConversationResponseDto>;
    getConversationEntity(conversationId: string): Promise<Conversation>;
    private isUserInConversation;
    private generateConversationTitle;
    private formatConversationResponse;
    private formatMessageResponse;
}
