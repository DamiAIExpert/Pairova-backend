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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const conversation_participant_entity_1 = require("./entities/conversation-participant.entity");
let ChatService = class ChatService {
    messageRepository;
    conversationRepository;
    participantRepository;
    constructor(messageRepository, conversationRepository, participantRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
    }
    async createMessage(createMessageDto, sender) {
        const { conversationId, content, attachmentId } = createMessageDto;
        const convo = await this.conversationRepository.findOne({
            where: { id: conversationId },
        });
        if (!convo) {
            throw new common_1.UnauthorizedException('Conversation not found or inaccessible.');
        }
        const isParticipant = await this.isUserInConversation(sender.id, conversationId);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not a participant of this conversation.');
        }
        const message = this.messageRepository.create({
            conversationId,
            content,
            attachmentId: attachmentId ?? null,
            senderId: sender.id,
        });
        return this.messageRepository.save(message);
    }
    async getMessagesForConversation(conversationId, userId) {
        const isParticipant = await this.isUserInConversation(userId, conversationId);
        if (!isParticipant) {
            throw new common_1.UnauthorizedException('You are not authorized to view these messages.');
        }
        return this.messageRepository.find({
            where: { conversationId },
            order: { sentAt: 'ASC' },
            relations: ['sender'],
        });
    }
    async isUserInConversation(userId, conversationId) {
        const participant = await this.participantRepository.findOne({
            where: { userId, conversationId },
        });
        return !!participant;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(2, (0, typeorm_1.InjectRepository)(conversation_participant_entity_1.ConversationParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map