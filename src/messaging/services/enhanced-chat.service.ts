import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(EnhancedChatService.name);

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
      relations: ['applicantProfile', 'nonprofitOrg'],
    });

    if (participants.length !== participantIds.length) {
      throw new BadRequestException('One or more participants not found');
    }

    // Check if a conversation already exists between creator and participant(s)
    // For DIRECT conversations, check if there's already a conversation with the same participants
    if (type === ConversationType.DIRECT && participantIds.length === 1) {
      const existingConversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoin('conversation.participants', 'p1', 'p1.user_id = :creatorId', { creatorId: creator.id })
        .innerJoin('conversation.participants', 'p2', 'p2.user_id = :participantId', { participantId: participantIds[0] })
        .where('conversation.type = :type', { type: ConversationType.DIRECT })
        .andWhere('conversation.is_archived = :isArchived', { isArchived: false })
        .getOne();

      if (existingConversation) {
        this.logger.log(`Found existing conversation ${existingConversation.id} between ${creator.id} and ${participantIds[0]}`);
        // Reload with all relations
        const conversationWithRelations = await this.conversationRepository.findOne({
          where: { id: existingConversation.id },
          relations: [
            'participants',
            'participants.user',
            'participants.user.applicantProfile',
            'participants.user.nonprofitOrg',
            'job',
            'job.organization',
          ],
        });

        if (conversationWithRelations) {
          return await this.formatConversationResponse(conversationWithRelations, creator.id);
        }
      }
    }

    // Validate job if provided
    let job = null;
    if (jobId) {
      job = await this.jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy', 'postedBy.nonprofitOrg'],
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

    // Ensure creator is included in participants
    const allParticipantIds = [...new Set([creator.id, ...participantIds])];

    // Add participants (creator + others)
    const participantEntities = allParticipantIds.map((userId) =>
      this.participantRepository.create({
        conversationId: savedConversation.id,
        userId,
        joinedAt: new Date(),
        role: userId === creator.id ? 'CREATOR' : 'PARTICIPANT',
      })
    );

    await this.participantRepository.save(participantEntities);

    // Reload conversation with all relations for formatting
    const conversationWithRelations = await this.conversationRepository.findOne({
      where: { id: savedConversation.id },
      relations: [
        'participants',
        'participants.user',
        'participants.user.applicantProfile',
        'participants.user.nonprofitOrg',
        'job',
        'job.organization',
      ],
    });

    if (!conversationWithRelations) {
      throw new NotFoundException('Conversation not found after creation');
    }

    return await this.formatConversationResponse(conversationWithRelations, creator.id);
  }

  /**
   * Get conversations for a user
   */
  async getUserConversations(
    userId: string,
    searchDto: ConversationSearchDto = {},
  ): Promise<{ conversations: ConversationResponseDto[]; total: number }> {
    const { query, type, jobId, participantId, includeArchived = false, page = 1, limit = 20 } = searchDto;

    this.logger.log(`Getting conversations for user ${userId} with filters:`, searchDto);

    // Use innerJoin for filtering by participant, then leftJoinAndSelect for loading relations
    const queryBuilder = this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.participants', 'participant', 'participant.user_id = :userId', { userId })
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('user.applicantProfile', 'applicantProfile')
      .leftJoinAndSelect('user.nonprofitOrg', 'nonprofitOrg')
      .leftJoinAndSelect('conversation.job', 'job')
      .leftJoinAndSelect('job.organization', 'jobOrganization');

    if (!includeArchived) {
      queryBuilder.andWhere('conversation.is_archived = :isArchived', { isArchived: false });
    }

    if (type) {
      queryBuilder.andWhere('conversation.type = :type', { type });
    }

    if (jobId) {
      queryBuilder.andWhere('conversation.job_id = :jobId', { jobId });
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

    // Order by lastMessageAt DESC (NULLS LAST), then by createdAt DESC
    // This ensures conversations with recent messages appear first
    // Use raw SQL to handle NULL values properly - conversations without messages will sort by createdAt
    queryBuilder
      .orderBy('conversation.lastMessageAt', 'DESC')
      .addOrderBy('conversation.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [conversations, total] = await queryBuilder.getManyAndCount();

    this.logger.log(`Found ${conversations.length} conversations (total: ${total}) for user ${userId}`);

    const formattedConversations = await Promise.all(
      conversations.map(conv => this.formatConversationResponse(conv, userId))
    );

    this.logger.log(`Formatted ${formattedConversations.length} conversations for user ${userId}`);

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

    // Check if user is a participant
    // If participants array is empty, try to reload or check directly in database
    let isParticipant = conversation.participants?.some(p => p.userId === sender.id);
    
    if (!isParticipant) {
      // Double-check by querying participant directly (handles race conditions)
      const participant = await this.participantRepository.findOne({
        where: {
          conversationId: conversationId,
          userId: sender.id,
        },
      });
      
      if (!participant) {
        this.logger.warn(
          `User ${sender.id} (${sender.email}) attempted to send message in conversation ${conversationId} but is not a participant. ` +
          `Participants in conversation: ${conversation.participants?.map(p => p.userId).join(', ') || 'none'}`
        );
        throw new UnauthorizedException('You are not a participant in this conversation');
      }
      
      // If participant exists but wasn't loaded, reload conversation with participants
      // This handles race conditions where participant was just added
      const reloadedConversation = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      });
      
      if (reloadedConversation) {
        isParticipant = reloadedConversation.participants?.some(p => p.userId === sender.id) || false;
      }
      
      if (!isParticipant) {
        this.logger.error(
          `Participant record exists but user ${sender.id} still not found in conversation ${conversationId} participants`
        );
        throw new UnauthorizedException('You are not a participant in this conversation');
      }
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
      // Use query builder - TypeORM will handle column mapping automatically
      replyTo = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.applicantProfile', 'applicantProfile')
        .leftJoinAndSelect('sender.nonprofitOrg', 'nonprofitOrg')
        .where('message.id = :replyToId', { replyToId })
        .andWhere('message.conversation_id = :conversationId', { conversationId })
        .getOne();
      if (!replyTo) {
        throw new BadRequestException('Reply-to message not found');
      }
    }

    // Create message
    // Note: attachmentId column doesn't exist in database, so we don't save it
    const message = this.messageRepository.create({
      conversationId: conversationId,
      senderId: sender.id,
      type: type as MessageType,
      content,
      // attachmentId, // Column doesn't exist in database
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

    // Reload message with all relations needed for formatting
    const messageWithRelations = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: [
        'sender',
        'sender.applicantProfile',
        'sender.nonprofitOrg',
        'replyTo',
        'replyTo.sender',
        'replyTo.sender.applicantProfile',
        'replyTo.sender.nonprofitOrg',
      ],
    });

    if (!messageWithRelations) {
      throw new NotFoundException('Message not found after creation');
    }

    return await this.formatMessageResponse(messageWithRelations, sender.id);
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

    // Get messages using find with relations to avoid TypeORM query builder metadata issues
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversationId },
      relations: [
        'sender',
        'sender.applicantProfile',
        'sender.nonprofitOrg',
        'replyTo',
        'replyTo.sender',
        'replyTo.sender.applicantProfile',
        'replyTo.sender.nonprofitOrg',
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
        'participants.user.nonprofitOrg',
        'job',
        'job.organization',
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return await this.formatConversationResponse(conversation, userId);
  }

  /**
   * Get conversation entity (for internal use, e.g., checking participants)
   */
  async getConversationEntity(conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: [
        'participants',
        'participants.user',
        'participants.user.applicantProfile',
        'participants.user.nonprofitOrg',
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
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
      if (p.nonprofitOrg) {
        return p.nonprofitOrg.orgName;
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
    // Use query builder with explicit database column names (snake_case)
    // Note: isDeleted column doesn't exist in the database migration, so we skip that check
    const unreadCount = await this.messageStatusRepository
      .createQueryBuilder('ms')
      .innerJoin('ms.message', 'message')
      .where('ms.user_id = :userId', { userId })
      .andWhere('ms.status = :status', { status: MessageStatusType.SENT })
      .andWhere('message.conversation_id = :conversationId', { conversationId: conversation.id })
      .getCount();

    // Get last message
    // Note: isDeleted and attachment_id columns don't exist in the database migration
    // Use find with relations for better reliability
    const lastMessage = await this.messageRepository.findOne({
      where: { conversationId: conversation.id },
      relations: [
        'sender',
        'sender.applicantProfile',
        'sender.nonprofitOrg',
      ],
      order: { sentAt: 'DESC' },
    });

    this.logger.debug(`Last message for conversation ${conversation.id}: ${lastMessage ? lastMessage.id : 'none'}`);

    return {
      id: conversation.id,
      type: conversation.type,
      status: conversation.status,
      title: conversation.title,
      description: conversation.description,
      job: conversation.job ? {
        id: conversation.job.id,
        title: conversation.job.title,
        orgName: conversation.job.organization?.orgName || 'Unknown',
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
          orgName: p.user.nonprofitOrg?.orgName,
          photoUrl: p.user.applicantProfile?.photoUrl || p.user.nonprofitOrg?.logoUrl,
        },
      })),
      lastMessage: lastMessage ? await this.formatMessageResponse(lastMessage, userId) : null,
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
          orgName: message.sender.nonprofitOrg?.orgName, // Use nonprofitOrg, not nonprofitProfile
        },
      },
      type: message.type,
      content: message.content,
      // attachment: message.attachment ? { ... } : undefined, // attachment_id column doesn't exist
      attachment: undefined, // attachment_id column doesn't exist in database
      replyTo: message.replyTo ? {
        id: message.replyTo.id,
        content: message.replyTo.content,
        sender: {
          firstName: message.replyTo.sender.applicantProfile?.firstName,
          lastName: message.replyTo.sender.applicantProfile?.lastName,
          orgName: message.replyTo.sender.nonprofitOrg?.orgName, // Use nonprofitOrg, not nonprofitProfile
        },
      } : undefined,
      status: status?.status || MessageStatusType.SENT,
      sentAt: message.sentAt,
      // isDeleted: message.isDeleted, // Column doesn't exist in database
      isDeleted: false,
      metadata: message.metadata,
    };
  }
}
