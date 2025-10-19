import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message, MessageType } from '../entities/message.entity';
import { Conversation, ConversationType, ConversationStatus } from '../entities/conversation.entity';
import { ConversationParticipant } from '../entities/conversation-participant.entity';
import { MessageStatus, MessageStatusType } from '../entities/message-status.entity';
import { User, Role } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Upload } from '../../profiles/uploads/entities/upload.entity';
import { 
  CreateConversationDto, 
  UpdateConversationDto, 
  SendMessageDto, 
  ConversationResponseDto, 
  MessageResponseDto,
  ConversationSearchDto 
} from '../dto/chat.dto';

/**
 * @class EnhancedChatService
 * @description Enhanced chat service with advanced features for NGO-candidate communication
 */
@Injectable()
export class EnhancedChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(MessageStatus)
    private readonly messageStatusRepository: Repository<MessageStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  /**
   * Create a new conversation
   */
  async createConversation(
    createConversationDto: CreateConversationDto,
    creator: User,
  ): Promise<ConversationResponseDto> {
    const { type, title, description, jobId, participantIds, applicationId, interviewId, metadata } = createConversationDto;

    // Validate participants
    const participants = await this.userRepository.find({
      where: { id: In(participantIds) },
      relations: ['applicantProfile', 'nonprofitProfile'],
    });

    if (participants.length !== participantIds.length) {
      throw new BadRequestException('One or more participants not found');
    }

    // Validate job if provided
    let job = null;
    if (jobId) {
      job = await this.jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy', 'postedBy.nonprofitProfile'],
      });
      if (!job) {
        throw new BadRequestException('Job not found');
      }
    }

    // Create conversation
    const conversation = this.conversationRepository.create({
      type,
      title: title || this.generateConversationTitle(participants, type, job),
      description,
      jobId,
      createdById: creator.id,
      metadata: {
        ...metadata,
        applicationId,
        interviewId,
      },
    });

    const savedConversation = await this.conversationRepository.save(conversation);

    // Add participants
    const participantEntities = participantIds.map((userId, index) =>
      this.participantRepository.create({
        conversationId: savedConversation.id,
        userId,
        joinedAt: new Date(),
        role: userId === creator.id ? 'CREATOR' : 'PARTICIPANT',
      })
    );

    await this.participantRepository.save(participantEntities);

    return this.formatConversationResponse(savedConversation, creator.id);
  }

  /**
   * Get conversations for a user
   */
  async getUserConversations(
    userId: string,
    searchDto: ConversationSearchDto = {},
  ): Promise<{ conversations: ConversationResponseDto[]; total: number }> {
    const { query, type, jobId, participantId, includeArchived = false, page = 1, limit = 20 } = searchDto;

    const queryBuilder = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect('user.applicantProfile', 'applicantProfile')
      .leftJoinAndSelect('user.nonprofitProfile', 'nonprofitProfile')
      .leftJoinAndSelect('conversation.job', 'job')
      .leftJoinAndSelect('job.postedBy', 'jobPostedBy')
      .leftJoinAndSelect('jobPostedBy.nonprofitProfile', 'jobOrgProfile')
      .where('participant.userId = :userId', { userId });

    if (!includeArchived) {
      queryBuilder.andWhere('conversation.isArchived = :isArchived', { isArchived: false });
    }

    if (type) {
      queryBuilder.andWhere('conversation.type = :type', { type });
    }

    if (jobId) {
      queryBuilder.andWhere('conversation.jobId = :jobId', { jobId });
    }

    if (query) {
      queryBuilder.andWhere(
        '(conversation.title ILIKE :query OR conversation.description ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (participantId) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM conversation_participants cp2 WHERE cp2.conversation_id = conversation.id AND cp2.user_id = :participantId)',
        { participantId }
      );
    }

    queryBuilder
      .orderBy('conversation.lastMessageAt', 'DESC')
      .addOrderBy('conversation.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [conversations, total] = await queryBuilder.getManyAndCount();

    const formattedConversations = await Promise.all(
      conversations.map(conv => this.formatConversationResponse(conv, userId))
    );

    return {
      conversations: formattedConversations,
      total,
    };
  }

  /**
   * Send a message
   */
  async sendMessage(
    sendMessageDto: SendMessageDto,
    sender: User,
  ): Promise<MessageResponseDto> {
    const { conversationId, content, type = 'TEXT', attachmentId, replyToId, metadata } = sendMessageDto;

    // Validate conversation and sender participation
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.participants.some(p => p.userId === sender.id);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not a participant in this conversation');
    }

    // Validate attachment if provided
    let attachment = null;
    if (attachmentId) {
      attachment = await this.uploadRepository.findOne({
        where: { id: attachmentId },
      });
      if (!attachment) {
        throw new BadRequestException('Attachment not found');
      }
    }

    // Validate reply-to message if provided
    let replyTo = null;
    if (replyToId) {
      replyTo = await this.messageRepository.findOne({
        where: { id: replyToId, conversationId },
        relations: ['sender', 'sender.applicantProfile', 'sender.nonprofitProfile'],
      });
      if (!replyTo) {
        throw new BadRequestException('Reply-to message not found');
      }
    }

    // Create message
    const message = this.messageRepository.create({
      conversationId: conversationId,
      senderId: sender.id,
      type: type as MessageType,
      content,
      attachmentId,
      replyToId,
      metadata,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Update conversation last message timestamp
    await this.conversationRepository.update(conversationId, {
      lastMessageAt: new Date(),
    });

    // Create message status for all participants
    const participantIds = conversation.participants
      .filter(p => p.userId !== sender.id)
      .map(p => p.userId);

    const messageStatuses = participantIds.map(participantId =>
      this.messageStatusRepository.create({
        messageId: savedMessage.id,
        userId: participantId,
        status: MessageStatusType.SENT,
      })
    );

    await this.messageStatusRepository.save(messageStatuses);

    // Create status for sender (delivered)
    const senderStatus = this.messageStatusRepository.create({
      messageId: savedMessage.id,
      userId: sender.id,
      status: MessageStatusType.DELIVERED,
    });

    await this.messageStatusRepository.save(senderStatus);

    return this.formatMessageResponse(savedMessage, sender.id);
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ messages: MessageResponseDto[]; total: number }> {
    // Validate user participation
    const isParticipant = await this.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not authorized to view these messages');
    }

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversationId, isDeleted: false },
      relations: [
        'sender',
        'sender.applicantProfile',
        'sender.nonprofitProfile',
        'attachment',
        'replyTo',
        'replyTo.sender',
        'replyTo.sender.applicantProfile',
        'replyTo.sender.nonprofitProfile',
      ],
      order: { sentAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Mark messages as read
    await this.markMessagesAsRead(messages.map(m => m.id), userId);

    const formattedMessages = await Promise.all(
      messages.map(msg => this.formatMessageResponse(msg, userId))
    );

    return {
      messages: formattedMessages.reverse(), // Return in chronological order
      total,
    };
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    if (messageIds.length === 0) return;

    await this.messageStatusRepository
      .createQueryBuilder()
      .update(MessageStatus)
      .set({ 
        status: MessageStatusType.READ,
        updatedAt: new Date(),
      })
      .where('messageId IN (:...messageIds)', { messageIds })
      .andWhere('userId = :userId', { userId })
      .andWhere('status != :status', { status: MessageStatusType.READ })
      .execute();
  }

  /**
   * Update message status
   */
  async updateMessageStatus(
    messageId: string,
    userId: string,
    status: MessageStatusType,
  ): Promise<void> {
    await this.messageStatusRepository.update(
      { messageId, userId },
      { status, updatedAt: new Date() }
    );
  }

  /**
   * Add participant to conversation
   */
  async addParticipant(
    conversationId: string,
    userId: string,
    addedBy: User,
  ): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is already a participant
    const isAlreadyParticipant = conversation.participants.some(p => p.userId === userId);
    if (isAlreadyParticipant) {
      throw new BadRequestException('User is already a participant');
    }

    // Check if adder is a participant
    const isAdderParticipant = conversation.participants.some(p => p.userId === addedBy.id);
    if (!isAdderParticipant) {
      throw new UnauthorizedException('You are not authorized to add participants');
    }

    const participant = this.participantRepository.create({
      conversationId,
      userId,
      joinedAt: new Date(),
      role: 'PARTICIPANT',
    });

    await this.participantRepository.save(participant);
  }

  /**
   * Remove participant from conversation
   */
  async removeParticipant(
    conversationId: string,
    userId: string,
    removedBy: User,
  ): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if remover is a participant
    const isRemoverParticipant = conversation.participants.some(p => p.userId === removedBy.id);
    if (!isRemoverParticipant && removedBy.role !== Role.ADMIN) {
      throw new UnauthorizedException('You are not authorized to remove participants');
    }

    // Cannot remove yourself unless you're an admin
    if (userId === removedBy.id && removedBy.role !== Role.ADMIN) {
      throw new BadRequestException('You cannot remove yourself from the conversation');
    }

    await this.participantRepository.delete({ conversationId, userId });
  }

  /**
   * Archive/unarchive conversation
   */
  async archiveConversation(
    conversationId: string,
    userId: string,
    isArchived: boolean,
  ): Promise<void> {
    const isParticipant = await this.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not authorized to modify this conversation');
    }

    await this.conversationRepository.update(conversationId, { isArchived });
  }

  /**
   * Get conversation by ID
   */
  async getConversation(
    conversationId: string,
    userId: string,
  ): Promise<ConversationResponseDto> {
    const isParticipant = await this.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not authorized to view this conversation');
    }

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: [
        'participants',
        'participants.user',
        'participants.user.applicantProfile',
        'participants.user.nonprofitProfile',
        'job',
        'job.postedBy',
        'job.postedBy.nonprofitProfile',
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.formatConversationResponse(conversation, userId);
  }

  /**
   * Check if user is in conversation
   */
  private async isUserInConversation(userId: string, conversationId: string): Promise<boolean> {
    const participant = await this.participantRepository.findOne({
      where: { userId, conversationId },
    });
    return !!participant;
  }

  /**
   * Generate conversation title
   */
  private generateConversationTitle(
    participants: User[],
    type: ConversationType,
    job?: Job | null,
  ): string {
    if (type === ConversationType.JOB_RELATED && job) {
      return `Job Discussion: ${job.title}`;
    }

    if (type === ConversationType.INTERVIEW) {
      return 'Interview Discussion';
    }

    if (type === ConversationType.SUPPORT) {
      return 'Support Conversation';
    }

    // For direct conversations, use participant names
    const names = participants.map(p => {
      if (p.applicantProfile) {
        return `${p.applicantProfile.firstName} ${p.applicantProfile.lastName}`;
      }
      if (p.nonprofitProfile) {
        return p.nonprofitProfile.orgName;
      }
      return p.email;
    });

    return names.join(', ');
  }

  /**
   * Format conversation response
   */
  private async formatConversationResponse(
    conversation: Conversation,
    userId: string,
  ): Promise<ConversationResponseDto> {
    // Get unread count
    const unreadCount = await this.messageStatusRepository.count({
      where: {
        userId,
        status: MessageStatusType.SENT,
        message: {
          conversationId: conversation.id,
          isDeleted: false,
        },
      },
      relations: ['message'],
    });

    // Get last message
    const lastMessage = await this.messageRepository.findOne({
      where: { conversationId: conversation.id, isDeleted: false },
      relations: [
        'sender',
        'sender.applicantProfile',
        'sender.nonprofitProfile',
        'attachment',
      ],
      order: { sentAt: 'DESC' },
    });

    return {
      id: conversation.id,
      type: conversation.type,
      status: conversation.status,
      title: conversation.title,
      description: conversation.description,
      job: conversation.job ? {
        id: conversation.job.id,
        title: conversation.job.title,
        orgName: conversation.job.postedBy.nonprofitProfile?.orgName || 'Unknown',
      } : undefined,
      participants: conversation.participants.map(p => ({
        id: p.user.id,
        email: p.user.email,
        role: p.user.role,
        joinedAt: p.joinedAt,
        lastSeenAt: p.lastSeenAt,
        profile: {
          firstName: p.user.applicantProfile?.firstName,
          lastName: p.user.applicantProfile?.lastName,
          orgName: p.user.nonprofitProfile?.orgName,
          photoUrl: p.user.applicantProfile?.photoUrl || p.user.nonprofitProfile?.logoUrl,
        },
      })),
      lastMessage: lastMessage ? await this.formatMessageResponse(lastMessage, userId) : undefined,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount,
      createdAt: conversation.createdAt,
      metadata: conversation.metadata,
    };
  }

  /**
   * Format message response
   */
  private async formatMessageResponse(
    message: Message,
    userId: string,
  ): Promise<MessageResponseDto> {
    // Get message status for current user
    const status = await this.messageStatusRepository.findOne({
      where: { messageId: message.id, userId },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      sender: {
        id: message.sender.id,
        email: message.sender.email,
        role: message.sender.role,
        profile: {
          firstName: message.sender.applicantProfile?.firstName,
          lastName: message.sender.applicantProfile?.lastName,
          orgName: message.sender.nonprofitProfile?.orgName,
        },
      },
      type: message.type,
      content: message.content,
      attachment: message.attachment ? {
        id: message.attachment.id,
        filename: message.attachment.filename,
        url: message.attachment.url,
        size: message.attachment.size,
        mimeType: message.attachment.mimeType,
      } : undefined,
      replyTo: message.replyTo ? {
        id: message.replyTo.id,
        content: message.replyTo.content,
        sender: {
          firstName: message.replyTo.sender.applicantProfile?.firstName,
          lastName: message.replyTo.sender.applicantProfile?.lastName,
          orgName: message.replyTo.sender.nonprofitProfile?.orgName,
        },
      } : undefined,
      status: status?.status || MessageStatusType.SENT,
      sentAt: message.sentAt,
      isDeleted: message.isDeleted,
      metadata: message.metadata,
    };
  }
}
