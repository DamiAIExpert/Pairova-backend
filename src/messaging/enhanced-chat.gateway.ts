import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';

import { EnhancedChatService } from './services/enhanced-chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { WsJwtGuard } from '../auth/strategies/ws-jwt.guard';
import { User } from '../users/shared/user.entity';
import { MessageStatusType } from './entities/message-status.entity';

/**
 * @class EnhancedChatGateway
 * @description Enhanced WebSocket gateway for real-time chat functionality
 */
@UseGuards(WsJwtGuard)
@WebSocketGateway({ 
  namespace: '/chat', 
  cors: { 
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true 
  } 
})
export class EnhancedChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server!: Server;

  private readonly logger = new Logger(EnhancedChatGateway.name);
  private connectedUsers: Map<string, User> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(private readonly chatService: EnhancedChatService) {}

  handleConnection(client: Socket) {
    const user = (client as any).user as User | undefined;

    if (!user) {
      this.logger.warn(`Client ${client.id} failed to connect: unauthenticated.`);
      client.disconnect(true);
      return;
    }

    this.connectedUsers.set(client.id, user);
    this.userSockets.set(user.id, client.id);
    
    // Join user to their personal room
    client.join(user.id);
    
    this.logger.log(`Client connected: ${user.email} (${client.id})`);
    
    // Notify user's contacts about online status
    this.notifyContactsOnlineStatus(user.id, true);
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.connectedUsers.delete(client.id);
      this.userSockets.delete(user.id);
      
      this.logger.log(`Client disconnected: ${user.email} (${client.id})`);
      
      // Notify user's contacts about offline status
      this.notifyContactsOnlineStatus(user.id, false);
    } else {
      this.logger.log(`Client disconnected: (unknown user) (${client.id})`);
    }
  }

  /**
   * Send a message
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sender = this.connectedUsers.get(client.id);
    if (!sender) {
      client.emit('error', { message: 'Unauthorized. Please reconnect.' });
      return;
    }

    try {
      const message = await this.chatService.sendMessage(sendMessageDto, sender);
      
      // Emit to all participants in the conversation
      this.server.to(sendMessageDto.conversationId).emit('newMessage', message);
      
      // Emit typing stop event
      this.server.to(sendMessageDto.conversationId).emit('stopTyping', {
        userId: sender.id,
        conversationId: sendMessageDto.conversationId,
      });

      this.logger.log(`Message sent by ${sender.email} in conversation ${sendMessageDto.conversationId}`);
    } catch (error: any) {
      this.logger.error(`Failed to send message: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to send message.', 
        details: error.message 
      });
    }
  }

  /**
   * Join a conversation
   */
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: 'Unauthorized. Please reconnect.' });
      return;
    }

    if (!conversationId) {
      client.emit('error', { message: 'conversationId is required' });
      return;
    }

    try {
      // Verify user is participant in conversation
      const conversation = await this.chatService.getConversation(conversationId, user.id);
      
      client.join(conversationId);
      this.logger.log(`User ${user.email} joined conversation ${conversationId}`);
      
      // Mark all messages in this conversation as read
      const messages = await this.chatService.getConversationMessages(conversationId, user.id, 1, 100);
      if (messages.messages.length > 0) {
        const messageIds = messages.messages.map(m => m.id);
        await this.chatService.markMessagesAsRead(messageIds, user.id);
        
        // Notify other participants that messages were read
        this.server.to(conversationId).emit('messagesRead', {
          conversationId,
          userId: user.id,
          messageIds,
        });
      }
      
    } catch (error: any) {
      this.logger.error(`Failed to join conversation: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to join conversation.', 
        details: error.message 
      });
    }
  }

  /**
   * Leave a conversation
   */
  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!conversationId) {
      client.emit('error', { message: 'conversationId is required' });
      return;
    }

    client.leave(conversationId);
    this.logger.log(`Client ${client.id} left conversation ${conversationId}`);
  }

  /**
   * Handle typing indicator
   */
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ): void {
    const user = this.connectedUsers.get(client.id);
    if (!user) return;

    // Broadcast typing status to other participants
    client.to(data.conversationId).emit('userTyping', {
      userId: user.id,
      conversationId: data.conversationId,
      isTyping: data.isTyping,
      timestamp: new Date(),
    });
  }

  /**
   * Handle message status updates (delivered, read)
   */
  @SubscribeMessage('updateMessageStatus')
  async handleUpdateMessageStatus(
    @MessageBody() data: { messageId: string; status: MessageStatusType },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.connectedUsers.get(client.id);
    if (!user) return;

    try {
      await this.chatService.updateMessageStatus(data.messageId, user.id, data.status);
      
      // Broadcast status update to conversation participants
      const message = await this.chatService.getConversationMessages(
        (data as any).conversationId, 
        user.id, 
        1, 
        1
      );
      
      if (message.messages.length > 0) {
        const conversationId = message.messages[0].conversationId;
        this.server.to(conversationId).emit('messageStatusUpdate', {
          messageId: data.messageId,
          userId: user.id,
          status: data.status,
          timestamp: new Date(),
        });
      }
    } catch (error: any) {
      this.logger.error(`Failed to update message status: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to update message status.', 
        details: error.message 
      });
    }
  }

  /**
   * Handle file sharing
   */
  @SubscribeMessage('shareFile')
  async handleShareFile(
    @MessageBody() data: { 
      conversationId: string; 
      fileId: string; 
      message?: string 
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: 'Unauthorized. Please reconnect.' });
      return;
    }

    try {
      const sendMessageDto: SendMessageDto = {
        conversationId: data.conversationId,
        content: data.message || 'Shared a file',
        type: 'FILE',
        attachmentId: data.fileId,
      };

      const message = await this.chatService.sendMessage(sendMessageDto, user);
      
      // Emit to all participants in the conversation
      this.server.to(data.conversationId).emit('newMessage', message);
      
      this.logger.log(`File shared by ${user.email} in conversation ${data.conversationId}`);
    } catch (error: any) {
      this.logger.error(`Failed to share file: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to share file.', 
        details: error.message 
      });
    }
  }

  /**
   * Handle conversation creation
   */
  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    @MessageBody() data: {
      type: string;
      title?: string;
      description?: string;
      jobId?: string;
      participantIds: string[];
      metadata?: any;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.connectedUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: 'Unauthorized. Please reconnect.' });
      return;
    }

    try {
      const conversation = await this.chatService.createConversation(data, user);
      
      // Join all participants to the new conversation room
      const socketIds = data.participantIds
        .map(participantId => this.userSockets.get(participantId))
        .filter(Boolean);

      socketIds.forEach(socketId => {
        if (socketId) {
          this.server.sockets.sockets.get(socketId)?.join(conversation.id);
        }
      });

      // Emit conversation created to all participants
      this.server.to(conversation.id).emit('conversationCreated', conversation);
      
      this.logger.log(`Conversation created by ${user.email}: ${conversation.id}`);
    } catch (error: any) {
      this.logger.error(`Failed to create conversation: ${error.message}`);
      client.emit('error', { 
        message: 'Failed to create conversation.', 
        details: error.message 
      });
    }
  }

  /**
   * Handle online status requests
   */
  @SubscribeMessage('getOnlineStatus')
  async handleGetOnlineStatus(
    @MessageBody() data: { userIds: string[] },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const onlineStatuses = data.userIds.map(userId => ({
      userId,
      isOnline: this.userSockets.has(userId),
      lastSeen: new Date(), // TODO: Implement last seen tracking
    }));

    client.emit('onlineStatuses', onlineStatuses);
  }

  /**
   * Notify contacts about online status change
   */
  private async notifyContactsOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      // Get user's conversations to find contacts
      const conversations = await this.chatService.getUserConversations(userId);
      
      conversations.conversations.forEach(conversation => {
        const otherParticipants = conversation.participants.filter(p => p.id !== userId);
        
        otherParticipants.forEach(participant => {
          const participantSocketId = this.userSockets.get(participant.id);
          if (participantSocketId) {
            this.server.to(participantSocketId).emit('contactStatusChange', {
              userId,
              isOnline,
              timestamp: new Date(),
            });
          }
        });
      });
    } catch (error: any) {
      this.logger.error(`Failed to notify contacts about status change: ${error.message}`);
    }
  }

  /**
   * Send notification to specific user
   */
  public sendNotificationToUser(userId: string, notification: any): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  /**
   * Broadcast message to conversation
   */
  public broadcastToConversation(conversationId: string, event: string, data: any): void {
    this.server.to(conversationId).emit(event, data);
  }

  /**
   * Get online users count
   */
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
