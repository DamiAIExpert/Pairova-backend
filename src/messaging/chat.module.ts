// src/messaging/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/shared/user.module';

/**
 * @module ChatModule
 * @description Encapsulates the real-time chat functionality, including the WebSocket gateway
 * and the service for interacting with chat-related database entities.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, ConversationParticipant]),
    AuthModule,
    UsersModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
