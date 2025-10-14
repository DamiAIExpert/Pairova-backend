import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EnhancedChatService } from './services/enhanced-chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { MessageStatusType } from './entities/message-status.entity';
export declare class EnhancedChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    private userSockets;
    constructor(chatService: EnhancedChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSendMessage(sendMessageDto: SendMessageDto, client: Socket): Promise<void>;
    handleJoinConversation(conversationId: string, client: Socket): Promise<void>;
    handleLeaveConversation(conversationId: string, client: Socket): void;
    handleTyping(data: {
        conversationId: string;
        isTyping: boolean;
    }, client: Socket): void;
    handleUpdateMessageStatus(data: {
        messageId: string;
        status: MessageStatusType;
    }, client: Socket): Promise<void>;
    handleShareFile(data: {
        conversationId: string;
        fileId: string;
        message?: string;
    }, client: Socket): Promise<void>;
    handleCreateConversation(data: {
        type: string;
        title?: string;
        description?: string;
        jobId?: string;
        participantIds: string[];
        metadata?: any;
    }, client: Socket): Promise<void>;
    handleGetOnlineStatus(data: {
        userIds: string[];
    }, client: Socket): Promise<void>;
    private notifyContactsOnlineStatus;
    sendNotificationToUser(userId: string, notification: any): void;
    broadcastToConversation(conversationId: string, event: string, data: any): void;
    getOnlineUsersCount(): number;
    isUserOnline(userId: string): boolean;
}
