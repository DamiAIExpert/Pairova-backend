// src/messaging/messaging.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

import { UsersModule } from '../users/shared/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, ConversationParticipant]),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class MessagingModule {}
