"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../entities/message.entity");
const conversation_entity_1 = require("../entities/conversation.entity");
const conversation_participant_entity_1 = require("../entities/conversation-participant.entity");
const message_status_entity_1 = require("../entities/message-status.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const upload_entity_1 = require("../../profiles/uploads/entities/upload.entity");
let EnhancedChatService = class EnhancedChatService {
    messageRepository;
    conversationRepository;
    participantRepository;
    messageStatusRepository;
    userRepository;
    jobRepository;
    uploadRepository;
    constructor(messageRepository, conversationRepository, participantRepository, messageStatusRepository, userRepository, jobRepository, uploadRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.messageStatusRepository = messageStatusRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.uploadRepository = uploadRepository;
    }
    async createConversation(createConversationDto, creator) {
        const { type, title, description, jobId, participantIds, applicationId, interviewId, metadata } = createConversationDto;
        const participants = await this.userRepository.find({
            where: { id: (0, typeorm_2.In)(participantIds) },
            relations: ['applicantProfile', 'nonprofitProfile'],
        });
        if (participants.length !== participantIds.length) {
            throw new common_1.BadRequestException('One or more participants not found');
        }
        let job = null;
        if (jobId) {
            job = await this.jobRepository.findOne({
                where: { id: jobId },
                relations: ['postedBy', 'postedBy.nonprofitProfile'],
            });
            if (!job) {
                throw new common_1.BadRequestException('Job not found');
            }
        }
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
        const participantEntities = participantIds.map((userId, index) => this.participantRepository.create({
            conversationId: savedConversation.id,
            userId,
            joinedAt: new Date(),
            role: userId === creator.id ? 'CREATOR' : 'PARTICIPANT',
        }));
        await this.participantRepository.save(participantEntities);
        return this.formatConversationResponse(savedConversation, creator.id);
    }
    async getUserConversations(userId, searchDto = {}) {
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
            queryBuilder.andWhere('(conversation.title ILIKE :query OR conversation.description ILIKE :query)', { query: `%${query}%` });
        }
        if (participantId) {
            queryBuilder.andWhere('EXISTS (SELECT 1 FROM conversation_participants cp2 WHERE cp2.conversation_id = conversation.id AND cp2.user_id = :participantId)', { participantId });
        }
        queryBuilder
            .orderBy('conversation.lastMessageAt', 'DESC')
            .addOrderBy('conversation.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [conversations, total] = await queryBuilder.getManyAndCount();
        const formattedConversations = await Promise.all(conversations.map(conv => this.formatConversationResponse(conv, userId)));
        return {
            conversations: formattedConversations,
            total,
        };
    }
    async sendMessage(sendMessageDto, sender) {
        const { conversationId, content, type = 'TEXT', attachmentId, replyToId, metadata } = sendMessageDto;
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isParticipant = conversation.participants.some(p => p.userId === sender.id);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not a participant in this conversation');
        }
        let attachment = null;
        if (attachmentId) {
            attachment = await this.uploadRepository.findOne({
                where: { id: attachmentId },
            });
            if (!attachment) {
                throw new common_1.BadRequestException('Attachment not found');
            }
        }
        let replyTo = null;
        if (replyToId) {
            replyTo = await this.messageRepository.findOne({
                where: { id: replyToId, conversationId },
                relations: ['sender', 'sender.applicantProfile', 'sender.nonprofitProfile'],
            });
            if (!replyTo) {
                throw new common_1.BadRequestException('Reply-to message not found');
            }
        }
        const message = this.messageRepository.create({
            conversationId,
            senderId: sender.id,
            type,
            content,
            attachmentId,
            replyToId,
            metadata,
        });
        const savedMessage = await this.messageRepository.save(message);
        await this.conversationRepository.update(conversationId, {
            lastMessageAt: new Date(),
        });
        const participantIds = conversation.participants
            .filter(p => p.userId !== sender.id)
            .map(p => p.userId);
        const messageStatuses = participantIds.map(participantId => this.messageStatusRepository.create({
            messageId: savedMessage.id,
            userId: participantId,
            status: message_status_entity_1.MessageStatusType.SENT,
        }));
        await this.messageStatusRepository.save(messageStatuses);
        const senderStatus = this.messageStatusRepository.create({
            messageId: savedMessage.id,
            userId: sender.id,
            status: message_status_entity_1.MessageStatusType.DELIVERED,
        });
        await this.messageStatusRepository.save(senderStatus);
        return this.formatMessageResponse(savedMessage, sender.id);
    }
    async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
        const isParticipant = await this.isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not authorized to view these messages');
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
        await this.markMessagesAsRead(messages.map(m => m.id), userId);
        const formattedMessages = await Promise.all(messages.map(msg => this.formatMessageResponse(msg, userId)));
        return {
            messages: formattedMessages.reverse(),
            total,
        };
    }
    async markMessagesAsRead(messageIds, userId) {
        if (messageIds.length === 0)
            return;
        await this.messageStatusRepository
            .createQueryBuilder()
            .update(message_status_entity_1.MessageStatus)
            .set({
            status: message_status_entity_1.MessageStatusType.READ,
            updatedAt: new Date(),
        })
            .where('messageId IN (:...messageIds)', { messageIds })
            .andWhere('userId = :userId', { userId })
            .andWhere('status != :status', { status: message_status_entity_1.MessageStatusType.READ })
            .execute();
    }
    async updateMessageStatus(messageId, userId, status) {
        await this.messageStatusRepository.update({ messageId, userId }, { status, updatedAt: new Date() });
    }
    async addParticipant(conversationId, userId, addedBy) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isAlreadyParticipant = conversation.participants.some(p => p.userId === userId);
        if (isAlreadyParticipant) {
            throw new common_1.BadRequestException('User is already a participant');
        }
        const isAdderParticipant = conversation.participants.some(p => p.userId === addedBy.id);
        if (!isAdderParticipant) {
            throw new common_1.UnauthorizedException('You are not authorized to add participants');
        }
        const participant = this.participantRepository.create({
            conversationId,
            userId,
            joinedAt: new Date(),
            role: 'PARTICIPANT',
        });
        await this.participantRepository.save(participant);
    }
    async removeParticipant(conversationId, userId, removedBy) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isRemoverParticipant = conversation.participants.some(p => p.userId === removedBy.id);
        if (!isRemoverParticipant && removedBy.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.UnauthorizedException('You are not authorized to remove participants');
        }
        if (userId === removedBy.id && removedBy.role !== user_entity_1.Role.ADMIN) {
            throw new common_1.BadRequestException('You cannot remove yourself from the conversation');
        }
        await this.participantRepository.delete({ conversationId, userId });
    }
    async archiveConversation(conversationId, userId, isArchived) {
        const isParticipant = await this.isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not authorized to modify this conversation');
        }
        await this.conversationRepository.update(conversationId, { isArchived });
    }
    async getConversation(conversationId, userId) {
        const isParticipant = await this.isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not authorized to view this conversation');
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
            throw new common_1.NotFoundException('Conversation not found');
        }
        return this.formatConversationResponse(conversation, userId);
    }
    async isUserInConversation(userId, conversationId) {
        const participant = await this.participantRepository.findOne({
            where: { userId, conversationId },
        });
        return !!participant;
    }
    generateConversationTitle(participants, type, job) {
        if (type === conversation_entity_1.ConversationType.JOB_RELATED && job) {
            return `Job Discussion: ${job.title}`;
        }
        if (type === conversation_entity_1.ConversationType.INTERVIEW) {
            return 'Interview Discussion';
        }
        if (type === conversation_entity_1.ConversationType.SUPPORT) {
            return 'Support Conversation';
        }
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
    async formatConversationResponse(conversation, userId) {
        const unreadCount = await this.messageStatusRepository.count({
            where: {
                userId,
                status: message_status_entity_1.MessageStatusType.SENT,
                message: {
                    conversationId: conversation.id,
                    isDeleted: false,
                },
            },
            relations: ['message'],
        });
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
    async formatMessageResponse(message, userId) {
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
            status: status?.status || message_status_entity_1.MessageStatusType.SENT,
            sentAt: message.sentAt,
            isDeleted: message.isDeleted,
            metadata: message.metadata,
        };
    }
};
exports.EnhancedChatService = EnhancedChatService;
exports.EnhancedChatService = EnhancedChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(2, (0, typeorm_1.InjectRepository)(conversation_participant_entity_1.ConversationParticipant)),
    __param(3, (0, typeorm_1.InjectRepository)(message_status_entity_1.MessageStatus)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(6, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EnhancedChatService);
//# sourceMappingURL=enhanced-chat.service.js.map