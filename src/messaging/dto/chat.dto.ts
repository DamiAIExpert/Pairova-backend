import { IsEnum, IsString, IsOptional, IsUUID, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConversationType, ConversationStatus } from '../entities/conversation.entity';
import { MessageType } from '../entities/message.entity';
import { MessageStatusType } from '../entities/message-status.entity';

/**
 * @class CreateConversationDto
 * @description DTO for creating a new conversation
 */
export class CreateConversationDto {
  @ApiProperty({ enum: ConversationType, description: 'Type of conversation' })
  @IsEnum(ConversationType)
  type: ConversationType;

  @ApiPropertyOptional({ description: 'Conversation title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Conversation description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Job ID if job-related conversation' })
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @ApiProperty({ description: 'Array of participant user IDs', type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  participantIds: string[];

  @ApiPropertyOptional({ description: 'Application ID if related to an application' })
  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @ApiPropertyOptional({ description: 'Interview ID if interview-related' })
  @IsOptional()
  @IsUUID()
  interviewId?: string;

  @ApiPropertyOptional({ description: 'Conversation metadata' })
  @IsOptional()
  metadata?: {
    tags?: string[];
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    category?: string;
  };
}

/**
 * @class UpdateConversationDto
 * @description DTO for updating a conversation
 */
export class UpdateConversationDto {
  @ApiPropertyOptional({ description: 'Conversation title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Conversation description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ConversationStatus, description: 'Conversation status' })
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;

  @ApiPropertyOptional({ description: 'Whether conversation is archived' })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiPropertyOptional({ description: 'Conversation metadata' })
  @IsOptional()
  metadata?: {
    tags?: string[];
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    category?: string;
  };
}

/**
 * @class SendMessageDto
 * @description DTO for sending a message
 */
export class SendMessageDto {
  @ApiProperty({ description: 'Conversation ID' })
  @IsUUID()
  conversationId: string;

  @ApiPropertyOptional({ description: 'Message content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: MessageType, description: 'Message type' })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({ description: 'Attachment file ID' })
  @IsOptional()
  @IsUUID()
  attachmentId?: string;

  @ApiPropertyOptional({ description: 'Reply to message ID' })
  @IsOptional()
  @IsUUID()
  replyToId?: string;

  @ApiPropertyOptional({ description: 'Message metadata' })
  @IsOptional()
  metadata?: {
    isUrgent?: boolean;
    requiresResponse?: boolean;
    expiresAt?: Date;
  };
}

/**
 * @class MessageResponseDto
 * @description DTO for message response
 */
export class MessageResponseDto {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Conversation ID' })
  conversationId: string;

  @ApiProperty({ description: 'Sender ID' })
  senderId: string;

  @ApiProperty({ description: 'Sender information' })
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

  @ApiProperty({ enum: MessageType, description: 'Message type' })
  type: MessageType;

  @ApiPropertyOptional({ description: 'Message content' })
  content?: string;

  @ApiPropertyOptional({ description: 'Attachment information' })
  attachment?: {
    id: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  };

  @ApiPropertyOptional({ description: 'Reply to message' })
  replyTo?: {
    id: string;
    content: string;
    sender: {
      firstName?: string;
      lastName?: string;
      orgName?: string;
    };
  };

  @ApiProperty({ description: 'Message status for current user' })
  status: MessageStatusType;

  @ApiProperty({ description: 'Sent timestamp' })
  sentAt: Date;

  @ApiProperty({ description: 'Whether message is deleted' })
  isDeleted: boolean;

  @ApiPropertyOptional({ description: 'Message metadata' })
  metadata?: any;
}

/**
 * @class ConversationResponseDto
 * @description DTO for conversation response
 */
export class ConversationResponseDto {
  @ApiProperty({ description: 'Conversation ID' })
  id: string;

  @ApiProperty({ enum: ConversationType, description: 'Conversation type' })
  type: ConversationType;

  @ApiProperty({ enum: ConversationStatus, description: 'Conversation status' })
  status: ConversationStatus;

  @ApiPropertyOptional({ description: 'Conversation title' })
  title?: string;

  @ApiPropertyOptional({ description: 'Conversation description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Job information' })
  job?: {
    id: string;
    title: string;
    orgName: string;
  };

  @ApiProperty({ description: 'Participants' })
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

  @ApiPropertyOptional({ description: 'Last message' })
  lastMessage?: MessageResponseDto;

  @ApiPropertyOptional({ description: 'Last message timestamp' })
  lastMessageAt?: Date;

  @ApiProperty({ description: 'Unread message count' })
  unreadCount: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Conversation metadata' })
  metadata?: any;
}

/**
 * @class MessageStatusUpdateDto
 * @description DTO for updating message status
 */
export class MessageStatusUpdateDto {
  @ApiProperty({ enum: MessageStatusType, description: 'New message status' })
  @IsEnum(MessageStatusType)
  status: MessageStatusType;

  @ApiProperty({ description: 'Message ID' })
  @IsUUID()
  messageId: string;
}

/**
 * @class ConversationSearchDto
 * @description DTO for searching conversations
 */
export class ConversationSearchDto {
  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ enum: ConversationType, description: 'Filter by conversation type' })
  @IsOptional()
  @IsEnum(ConversationType)
  type?: ConversationType;

  @ApiPropertyOptional({ description: 'Filter by job ID' })
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @ApiPropertyOptional({ description: 'Filter by participant ID' })
  @IsOptional()
  @IsUUID()
  participantId?: string;

  @ApiPropertyOptional({ description: 'Include archived conversations' })
  @IsOptional()
  @IsBoolean()
  includeArchived?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number = 20;
}
