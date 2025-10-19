import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnhancedChatGateway } from './enhanced-chat.gateway';
import { EnhancedChatService } from './services/enhanced-chat.service';
import { ChatController } from './controllers/chat.controller';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { MessageStatus } from './entities/message-status.entity';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Upload } from '../profiles/uploads/entities/upload.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      ConversationParticipant,
      MessageStatus,
      User,
      Job,
      Upload,
    ]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [EnhancedChatGateway, EnhancedChatService],
  exports: [EnhancedChatService, EnhancedChatGateway],
})
export class MessagingModule {}
