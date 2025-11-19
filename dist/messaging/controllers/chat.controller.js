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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const enhanced_chat_service_1 = require("../services/enhanced-chat.service");
const chat_dto_1 = require("../dto/chat.dto");
const conversation_entity_1 = require("../entities/conversation.entity");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createConversation(createConversationDto, req) {
        return await this.chatService.createConversation(createConversationDto, req.user);
    }
    async getUserConversations(req, searchDto) {
        return await this.chatService.getUserConversations(req.user.id, searchDto);
    }
    async getConversation(id, req) {
        return await this.chatService.getConversation(id, req.user.id);
    }
    async updateConversation(id, updateConversationDto, req) {
        return await this.chatService.getConversation(id, req.user.id);
    }
    async archiveConversation(id, isArchived, req) {
        await this.chatService.archiveConversation(id, req.user.id, isArchived);
        return { message: 'Conversation archive status updated successfully' };
    }
    async addParticipant(conversationId, userId, req) {
        await this.chatService.addParticipant(conversationId, userId, req.user);
        return { message: 'Participant added successfully' };
    }
    async removeParticipant(conversationId, userId, req) {
        await this.chatService.removeParticipant(conversationId, userId, req.user);
        return { message: 'Participant removed successfully' };
    }
    async sendMessage(sendMessageDto, req) {
        return await this.chatService.sendMessage(sendMessageDto, req.user);
    }
    async getConversationMessages(conversationId, req, pageParam, limitParam) {
        const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;
        const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
        return await this.chatService.getConversationMessages(conversationId, req.user.id, page, limit);
    }
    async markMessagesAsRead(messageIds, req) {
        await this.chatService.markMessagesAsRead(messageIds, req.user.id);
        return { message: 'Messages marked as read successfully' };
    }
    async updateMessageStatus(messageId, statusUpdateDto, req) {
        await this.chatService.updateMessageStatus(messageId, req.user.id, statusUpdateDto.status);
        return { message: 'Message status updated successfully' };
    }
    async getChatStatistics() {
        return {
            totalConversations: 0,
            totalMessages: 0,
            activeConversations: 0,
            messagesToday: 0,
            topActiveUsers: [],
        };
    }
    async getAllConversations(searchDto) {
        return {
            conversations: [],
            total: 0,
        };
    }
    async deleteConversation(id) {
        return { message: 'Conversation deleted successfully' };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Conversation created successfully',
        type: chat_dto_1.ConversationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Participants or job not found' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user conversations with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversations retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false, type: String, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: conversation_entity_1.ConversationType, description: 'Filter by conversation type' }),
    (0, swagger_1.ApiQuery)({ name: 'jobId', required: false, type: String, description: 'Filter by job ID' }),
    (0, swagger_1.ApiQuery)({ name: 'participantId', required: false, type: String, description: 'Filter by participant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'includeArchived', required: false, type: Boolean, description: 'Include archived conversations' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.ConversationSearchDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation retrieved successfully',
        type: chat_dto_1.ConversationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Put)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation updated successfully',
        type: chat_dto_1.ConversationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.UpdateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateConversation", null);
__decorate([
    (0, common_1.Put)('conversations/:id/archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive or unarchive conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation archive status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('isArchived')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "archiveConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/participants'),
    (0, swagger_1.ApiOperation)({ summary: 'Add participant to conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Participant added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already a participant' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('userId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)('conversations/:id/participants/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove participant from conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Participant removed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent successfully',
        type: chat_dto_1.MessageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for a conversation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Unauthorized access' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.Put)('messages/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark messages as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages marked as read successfully',
    }),
    __param(0, (0, common_1.Body)('messageIds', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessagesAsRead", null);
__decorate([
    (0, common_1.Put)('messages/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update message status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.MessageStatusUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateMessageStatus", null);
__decorate([
    (0, common_1.Get)('admin/statistics'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatStatistics", null);
__decorate([
    (0, common_1.Get)('admin/conversations'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all conversations (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversations retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ConversationSearchDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllConversations", null);
__decorate([
    (0, common_1.Delete)('admin/conversations/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete conversation (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteConversation", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Messaging'),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [enhanced_chat_service_1.EnhancedChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map