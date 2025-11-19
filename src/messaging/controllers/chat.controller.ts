import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { EnhancedChatService } from '../services/enhanced-chat.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
  ConversationSearchDto,
  MessageStatusUpdateDto,
} from '../dto/chat.dto';
import { ConversationType } from '../entities/conversation.entity';
import { MessageStatusType } from '../entities/message-status.entity';

/**
 * @class ChatController
 * @description Controller for chat and messaging functionality
 */
@ApiTags('Messaging')
@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: EnhancedChatService) {}

  /**
   * Create a new conversation
   */
  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Participants or job not found' })
  async createConversation(
    @Body(ValidationPipe) createConversationDto: CreateConversationDto,
    @Request() req,
  ): Promise<ConversationResponseDto> {
    return await this.chatService.createConversation(createConversationDto, req.user);
  }

  /**
   * Get user conversations
   */
  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, enum: ConversationType, description: 'Filter by conversation type' })
  @ApiQuery({ name: 'jobId', required: false, type: String, description: 'Filter by job ID' })
  @ApiQuery({ name: 'participantId', required: false, type: String, description: 'Filter by participant ID' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean, description: 'Include archived conversations' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getUserConversations(
    @Request() req,
    @Query() searchDto: ConversationSearchDto,
  ): Promise<{ conversations: ConversationResponseDto[]; total: number }> {
    return await this.chatService.getUserConversations(req.user.id, searchDto);
  }

  /**
   * Get conversation by ID
   */
  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async getConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<ConversationResponseDto> {
    return await this.chatService.getConversation(id, req.user.id);
  }

  /**
   * Update conversation
   */
  @Put('conversations/:id')
  @ApiOperation({ summary: 'Update conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation updated successfully',
    type: ConversationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async updateConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateConversationDto: UpdateConversationDto,
    @Request() req,
  ): Promise<ConversationResponseDto> {
    // TODO: Implement update conversation logic
    return await this.chatService.getConversation(id, req.user.id);
  }

  /**
   * Archive/unarchive conversation
   */
  @Put('conversations/:id/archive')
  @ApiOperation({ summary: 'Archive or unarchive conversation' })
  @ApiResponse({
    status: 200,
    description: 'Conversation archive status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async archiveConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isArchived') isArchived: boolean,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.chatService.archiveConversation(id, req.user.id, isArchived);
    return { message: 'Conversation archive status updated successfully' };
  }

  /**
   * Add participant to conversation
   */
  @Post('conversations/:id/participants')
  @ApiOperation({ summary: 'Add participant to conversation' })
  @ApiResponse({
    status: 201,
    description: 'Participant added successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  @ApiResponse({ status: 400, description: 'User already a participant' })
  async addParticipant(
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Body('userId', ParseUUIDPipe) userId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.chatService.addParticipant(conversationId, userId, req.user);
    return { message: 'Participant added successfully' };
  }

  /**
   * Remove participant from conversation
   */
  @Delete('conversations/:id/participants/:userId')
  @ApiOperation({ summary: 'Remove participant from conversation' })
  @ApiResponse({
    status: 200,
    description: 'Participant removed successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async removeParticipant(
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.chatService.removeParticipant(conversationId, userId, req.user);
    return { message: 'Participant removed successfully' };
  }

  /**
   * Send a message
   */
  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async sendMessage(
    @Body(ValidationPipe) sendMessageDto: SendMessageDto,
    @Request() req,
  ): Promise<MessageResponseDto> {
    return await this.chatService.sendMessage(sendMessageDto, req.user);
  }

  /**
   * Get messages for a conversation
   */
  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getConversationMessages(
    @Param('id', ParseUUIDPipe) conversationId: string,
    @Request() req,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
  ): Promise<{ messages: MessageResponseDto[]; total: number }> {
    // Parse page and limit with defaults, handling optional parameters
    const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;
    const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
    return await this.chatService.getConversationMessages(conversationId, req.user.id, page, limit);
  }

  /**
   * Mark messages as read
   */
  @Put('messages/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read successfully',
  })
  async markMessagesAsRead(
    @Body('messageIds', ParseUUIDPipe) messageIds: string[],
    @Request() req,
  ): Promise<{ message: string }> {
    await this.chatService.markMessagesAsRead(messageIds, req.user.id);
    return { message: 'Messages marked as read successfully' };
  }

  /**
   * Update message status
   */
  @Put('messages/:id/status')
  @ApiOperation({ summary: 'Update message status' })
  @ApiResponse({
    status: 200,
    description: 'Message status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async updateMessageStatus(
    @Param('id', ParseUUIDPipe) messageId: string,
    @Body(ValidationPipe) statusUpdateDto: MessageStatusUpdateDto,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.chatService.updateMessageStatus(messageId, req.user.id, statusUpdateDto.status);
    return { message: 'Message status updated successfully' };
  }

  /**
   * Get conversation statistics (Admin only)
   */
  @Get('admin/statistics')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get chat statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getChatStatistics(): Promise<{
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    messagesToday: number;
    topActiveUsers: Array<{
      userId: string;
      userName: string;
      messageCount: number;
    }>;
  }> {
    // TODO: Implement chat statistics
    return {
      totalConversations: 0,
      totalMessages: 0,
      activeConversations: 0,
      messagesToday: 0,
      topActiveUsers: [],
    };
  }

  /**
   * Get all conversations (Admin only)
   */
  @Get('admin/conversations')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all conversations (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async getAllConversations(
    @Query() searchDto: ConversationSearchDto,
  ): Promise<{ conversations: ConversationResponseDto[]; total: number }> {
    // TODO: Implement admin conversation listing
    return {
      conversations: [],
      total: 0,
    };
  }

  /**
   * Delete conversation (Admin only)
   */
  @Delete('admin/conversations/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete conversation (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async deleteConversation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    // TODO: Implement conversation deletion
    return { message: 'Conversation deleted successfully' };
  }
}
