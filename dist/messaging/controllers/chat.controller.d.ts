import { EnhancedChatService } from '../services/enhanced-chat.service';
import { CreateConversationDto, UpdateConversationDto, SendMessageDto, ConversationResponseDto, MessageResponseDto, ConversationSearchDto, MessageStatusUpdateDto } from '../dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: EnhancedChatService);
    createConversation(createConversationDto: CreateConversationDto, req: any): Promise<ConversationResponseDto>;
    getUserConversations(req: any, searchDto: ConversationSearchDto): Promise<{
        conversations: ConversationResponseDto[];
        total: number;
    }>;
    getConversation(id: string, req: any): Promise<ConversationResponseDto>;
    updateConversation(id: string, updateConversationDto: UpdateConversationDto, req: any): Promise<ConversationResponseDto>;
    archiveConversation(id: string, isArchived: boolean, req: any): Promise<{
        message: string;
    }>;
    addParticipant(conversationId: string, userId: string, req: any): Promise<{
        message: string;
    }>;
    removeParticipant(conversationId: string, userId: string, req: any): Promise<{
        message: string;
    }>;
    sendMessage(sendMessageDto: SendMessageDto, req: any): Promise<MessageResponseDto>;
    getConversationMessages(conversationId: string, page: number, limit: number, req: any): Promise<{
        messages: MessageResponseDto[];
        total: number;
    }>;
    markMessagesAsRead(messageIds: string[], req: any): Promise<{
        message: string;
    }>;
    updateMessageStatus(messageId: string, statusUpdateDto: MessageStatusUpdateDto, req: any): Promise<{
        message: string;
    }>;
    getChatStatistics(): Promise<{
        totalConversations: number;
        totalMessages: number;
        activeConversations: number;
        messagesToday: number;
        topActiveUsers: Array<{
            userId: string;
            userName: string;
            messageCount: number;
        }>;
    }>;
    getAllConversations(searchDto: ConversationSearchDto): Promise<{
        conversations: ConversationResponseDto[];
        total: number;
    }>;
    deleteConversation(id: string): Promise<{
        message: string;
    }>;
}
