import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { EnhancedChatService } from './enhanced-chat.service';
import { Message } from '../entities/message.entity';
import { Conversation, ConversationType, ConversationStatus } from '../entities/conversation.entity';
import { ConversationParticipant } from '../entities/conversation-participant.entity';
import { MessageStatus } from '../entities/message-status.entity';
import { User, Role } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Upload } from '../../profiles/uploads/entities/upload.entity';
import { CreateConversationDto, SendMessageDto } from '../dto/chat.dto';

describe('EnhancedChatService', () => {
  let service: EnhancedChatService;
  let messageRepository: Repository<Message>;
  let conversationRepository: Repository<Conversation>;
  let participantRepository: Repository<ConversationParticipant>;
  let messageStatusRepository: Repository<MessageStatus>;
  let userRepository: Repository<User>;
  let jobRepository: Repository<Job>;
  let uploadRepository: Repository<Upload>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  });

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    role: Role.APPLICANT,
    passwordHash: 'hashed-password',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNGOUser: User = {
    id: 'ngo-1',
    email: 'ngo@example.com',
    role: Role.NONPROFIT,
    passwordHash: 'hashed-password',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJob: Job = {
    id: 'job-1',
    title: 'Software Developer',
    description: 'Full-stack developer position',
    requirements: 'React, Node.js',
    location: 'Remote',
    salaryRange: '$50k-80k',
    employmentType: 'FULL_TIME',
    postedById: 'ngo-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnhancedChatService,
        {
          provide: getRepositoryToken(Message),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Conversation),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(ConversationParticipant),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(MessageStatus),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Job),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Upload),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EnhancedChatService>(EnhancedChatService);
    messageRepository = module.get<Repository<Message>>(getRepositoryToken(Message));
    conversationRepository = module.get<Repository<Conversation>>(getRepositoryToken(Conversation));
    participantRepository = module.get<Repository<ConversationParticipant>>(getRepositoryToken(ConversationParticipant));
    messageStatusRepository = module.get<Repository<MessageStatus>>(getRepositoryToken(MessageStatus));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
    uploadRepository = module.get<Repository<Upload>>(getRepositoryToken(Upload));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a conversation successfully', async () => {
      const createConversationDto: CreateConversationDto = {
        type: ConversationType.DIRECT,
        title: 'Test Conversation',
        participantIds: ['user-1', 'ngo-1'],
      };

      const mockConversation: Conversation = {
        id: 'conv-1',
        type: ConversationType.DIRECT,
        status: ConversationStatus.ACTIVE,
        title: 'Test Conversation',
        description: null,
        jobId: null,
        createdById: 'user-1',
        isArchived: false,
        lastMessageAt: null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([mockUser, mockNGOUser]);
      jest.spyOn(conversationRepository, 'create').mockReturnValue(mockConversation);
      jest.spyOn(conversationRepository, 'save').mockResolvedValue(mockConversation);
      jest.spyOn(participantRepository, 'create').mockReturnValue({} as ConversationParticipant);
      jest.spyOn(participantRepository, 'save').mockResolvedValue({} as ConversationParticipant);

      const result = await service.createConversation(createConversationDto, mockUser);

      expect(result).toBeDefined();
      expect(result.id).toBe('conv-1');
      expect(result.type).toBe(ConversationType.DIRECT);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: { id: ['user-1', 'ngo-1'] },
        relations: ['applicantProfile', 'nonprofitProfile'],
      });
    });

    it('should throw BadRequestException when participants not found', async () => {
      const createConversationDto: CreateConversationDto = {
        type: ConversationType.DIRECT,
        participantIds: ['invalid-user'],
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await expect(service.createConversation(createConversationDto, mockUser))
        .rejects.toThrow(BadRequestException);
    });

    it('should create job-related conversation', async () => {
      const createConversationDto: CreateConversationDto = {
        type: ConversationType.JOB_RELATED,
        jobId: 'job-1',
        participantIds: ['user-1', 'ngo-1'],
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([mockUser, mockNGOUser]);
      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(mockJob);
      jest.spyOn(conversationRepository, 'create').mockReturnValue({} as Conversation);
      jest.spyOn(conversationRepository, 'save').mockResolvedValue({} as Conversation);
      jest.spyOn(participantRepository, 'create').mockReturnValue({} as ConversationParticipant);
      jest.spyOn(participantRepository, 'save').mockResolvedValue({} as ConversationParticipant);

      const result = await service.createConversation(createConversationDto, mockUser);

      expect(result).toBeDefined();
      expect(jobRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        relations: ['postedBy', 'postedBy.nonprofitProfile'],
      });
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const sendMessageDto: SendMessageDto = {
        conversationId: 'conv-1',
        content: 'Hello, world!',
      };

      const mockConversation: Conversation = {
        id: 'conv-1',
        type: ConversationType.DIRECT,
        status: ConversationStatus.ACTIVE,
        participants: [
          { userId: 'user-1', conversationId: 'conv-1' } as ConversationParticipant,
          { userId: 'ngo-1', conversationId: 'conv-1' } as ConversationParticipant,
        ],
      } as Conversation;

      const mockMessage: Message = {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        type: 'TEXT',
        content: 'Hello, world!',
        sentAt: new Date(),
        isDeleted: false,
      } as Message;

      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(mockConversation);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue({} as ConversationParticipant);
      jest.spyOn(messageRepository, 'create').mockReturnValue(mockMessage);
      jest.spyOn(messageRepository, 'save').mockResolvedValue(mockMessage);
      jest.spyOn(conversationRepository, 'update').mockResolvedValue({} as any);
      jest.spyOn(messageStatusRepository, 'create').mockReturnValue({} as MessageStatus);
      jest.spyOn(messageStatusRepository, 'save').mockResolvedValue({} as MessageStatus);

      const result = await service.sendMessage(sendMessageDto, mockUser);

      expect(result).toBeDefined();
      expect(result.content).toBe('Hello, world!');
      expect(conversationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'conv-1' },
        relations: ['participants'],
      });
    });

    it('should throw NotFoundException when conversation not found', async () => {
      const sendMessageDto: SendMessageDto = {
        conversationId: 'invalid-conv',
        content: 'Hello, world!',
      };

      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.sendMessage(sendMessageDto, mockUser))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when user not participant', async () => {
      const sendMessageDto: SendMessageDto = {
        conversationId: 'conv-1',
        content: 'Hello, world!',
      };

      const mockConversation: Conversation = {
        id: 'conv-1',
        participants: [
          { userId: 'other-user', conversationId: 'conv-1' } as ConversationParticipant,
        ],
      } as Conversation;

      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(mockConversation);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue(null);

      await expect(service.sendMessage(sendMessageDto, mockUser))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserConversations', () => {
    it('should return user conversations with pagination', async () => {
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          type: ConversationType.DIRECT,
          status: ConversationStatus.ACTIVE,
          participants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Conversation,
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockConversations, 1]),
      };

      jest.spyOn(conversationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      jest.spyOn(messageStatusRepository, 'count').mockResolvedValue(0);

      const result = await service.getUserConversations('user-1', { page: 1, limit: 20 });

      expect(result.conversations).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('participant.userId = :userId', { userId: 'user-1' });
    });

    it('should filter conversations by type', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest.spyOn(conversationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      jest.spyOn(messageStatusRepository, 'count').mockResolvedValue(0);

      await service.getUserConversations('user-1', { 
        type: ConversationType.JOB_RELATED,
        page: 1, 
        limit: 20 
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'conversation.type = :type', 
        { type: ConversationType.JOB_RELATED }
      );
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const messageIds = ['msg-1', 'msg-2'];
      const userId = 'user-1';

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      jest.spyOn(messageStatusRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      await service.markMessagesAsRead(messageIds, userId);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(MessageStatus);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        status: 'READ',
        updatedAt: expect.any(Date),
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('messageId IN (:...messageIds)', { messageIds });
    });

    it('should handle empty message IDs array', async () => {
      await expect(service.markMessagesAsRead([], 'user-1')).resolves.not.toThrow();
    });
  });

  describe('addParticipant', () => {
    it('should add participant to conversation', async () => {
      const mockConversation: Conversation = {
        id: 'conv-1',
        participants: [
          { userId: 'user-1', conversationId: 'conv-1' } as ConversationParticipant,
        ],
      } as Conversation;

      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(mockConversation);
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue({} as ConversationParticipant);
      jest.spyOn(participantRepository, 'create').mockReturnValue({} as ConversationParticipant);
      jest.spyOn(participantRepository, 'save').mockResolvedValue({} as ConversationParticipant);

      await service.addParticipant('conv-1', 'new-user', mockUser);

      expect(participantRepository.create).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        userId: 'new-user',
        joinedAt: expect.any(Date),
        role: 'PARTICIPANT',
      });
    });

    it('should throw BadRequestException when user already participant', async () => {
      const mockConversation: Conversation = {
        id: 'conv-1',
        participants: [
          { userId: 'user-1', conversationId: 'conv-1' } as ConversationParticipant,
          { userId: 'existing-user', conversationId: 'conv-1' } as ConversationParticipant,
        ],
      } as Conversation;

      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(mockConversation);

      await expect(service.addParticipant('conv-1', 'existing-user', mockUser))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('archiveConversation', () => {
    it('should archive conversation', async () => {
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue({} as ConversationParticipant);
      jest.spyOn(conversationRepository, 'update').mockResolvedValue({} as any);

      await service.archiveConversation('conv-1', 'user-1', true);

      expect(conversationRepository.update).toHaveBeenCalledWith('conv-1', { isArchived: true });
    });

    it('should throw UnauthorizedException when user not participant', async () => {
      jest.spyOn(participantRepository, 'findOne').mockResolvedValue(null);

      await expect(service.archiveConversation('conv-1', 'user-1', true))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
