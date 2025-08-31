// src/messaging/chat.gateway.ts
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

import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { WsJwtGuard } from '../auth/strategies/ws-jwt.guard';
import { User } from '../users/shared/user.entity';

/**
 * @class ChatGateway
 * @description WebSocket gateway for real-time chat functionality.
 */
@UseGuards(WsJwtGuard) // Secure the gateway with JWT authentication
@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers: Map<string, User> = new Map();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const user = (client as any).user as User | undefined;

    if (!user) {
      this.logger.warn(`Client ${client.id} failed to connect: unauthenticated.`);
      client.disconnect(true);
      return;
    }

    this.connectedUsers.set(client.id, user);
    client.join(user.id);
    this.logger.log(`Client connected: ${user.email ?? user.id} (${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    if (user) {
      this.logger.log(`Client disconnected: ${user.email ?? user.id} (${client.id})`);
      this.connectedUsers.delete(client.id);
    } else {
      this.logger.log(`Client disconnected: (unknown user) (${client.id})`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sender = this.connectedUsers.get(client.id);
    if (!sender) {
      client.emit('error', { message: 'Unauthorized. Please reconnect.' });
      return;
    }

    try {
      const message = await this.chatService.createMessage(createMessageDto, sender);
      this.server.to(createMessageDto.conversationId).emit('newMessage', message);
    } catch (err: unknown) {
      const msg = (err as any)?.message ?? 'Unknown error';
      this.logger.error(`Failed to handle message: ${msg}`);
      client.emit('error', { message: 'Failed to send message.', details: msg });
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!conversationId) {
      client.emit('error', { message: 'conversationId is required' });
      return;
    }
    client.join(conversationId);
    this.logger.log(`Client ${client.id} joined conversation ${conversationId}`);
  }
}
