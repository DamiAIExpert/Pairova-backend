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
var EnhancedChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const enhanced_chat_service_1 = require("./services/enhanced-chat.service");
const chat_dto_1 = require("./dto/chat.dto");
const ws_jwt_guard_1 = require("../auth/strategies/ws-jwt.guard");
let EnhancedChatGateway = EnhancedChatGateway_1 = class EnhancedChatGateway {
    chatService;
    server;
    logger = new common_1.Logger(EnhancedChatGateway_1.name);
    connectedUsers = new Map();
    userSockets = new Map();
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleConnection(client) {
        const user = client.user;
        if (!user) {
            this.logger.warn(`Client ${client.id} failed to connect: unauthenticated.`);
            client.disconnect(true);
            return;
        }
        this.connectedUsers.set(client.id, user);
        this.userSockets.set(user.id, client.id);
        client.join(user.id);
        this.logger.log(`Client connected: ${user.email} (${client.id})`);
        this.notifyContactsOnlineStatus(user.id, true);
    }
    handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            this.connectedUsers.delete(client.id);
            this.userSockets.delete(user.id);
            this.logger.log(`Client disconnected: ${user.email} (${client.id})`);
            this.notifyContactsOnlineStatus(user.id, false);
        }
        else {
            this.logger.log(`Client disconnected: (unknown user) (${client.id})`);
        }
    }
    async handleSendMessage(sendMessageDto, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender) {
            client.emit('error', { message: 'Unauthorized. Please reconnect.' });
            return;
        }
        try {
            const message = await this.chatService.sendMessage(sendMessageDto, sender);
            this.server.to(sendMessageDto.conversationId).emit('newMessage', message);
            this.server.to(sendMessageDto.conversationId).emit('stopTyping', {
                userId: sender.id,
                conversationId: sendMessageDto.conversationId,
            });
            this.logger.log(`Message sent by ${sender.email} in conversation ${sendMessageDto.conversationId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
            client.emit('error', {
                message: 'Failed to send message.',
                details: error.message
            });
        }
    }
    async handleJoinConversation(conversationId, client) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit('error', { message: 'Unauthorized. Please reconnect.' });
            return;
        }
        if (!conversationId) {
            client.emit('error', { message: 'conversationId is required' });
            return;
        }
        try {
            const conversation = await this.chatService.getConversation(conversationId, user.id);
            client.join(conversationId);
            this.logger.log(`User ${user.email} joined conversation ${conversationId}`);
            const messages = await this.chatService.getConversationMessages(conversationId, user.id, 1, 100);
            if (messages.messages.length > 0) {
                const messageIds = messages.messages.map(m => m.id);
                await this.chatService.markMessagesAsRead(messageIds, user.id);
                this.server.to(conversationId).emit('messagesRead', {
                    conversationId,
                    userId: user.id,
                    messageIds,
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to join conversation: ${error.message}`);
            client.emit('error', {
                message: 'Failed to join conversation.',
                details: error.message
            });
        }
    }
    handleLeaveConversation(conversationId, client) {
        if (!conversationId) {
            client.emit('error', { message: 'conversationId is required' });
            return;
        }
        client.leave(conversationId);
        this.logger.log(`Client ${client.id} left conversation ${conversationId}`);
    }
    handleTyping(data, client) {
        const user = this.connectedUsers.get(client.id);
        if (!user)
            return;
        client.to(data.conversationId).emit('userTyping', {
            userId: user.id,
            conversationId: data.conversationId,
            isTyping: data.isTyping,
            timestamp: new Date(),
        });
    }
    async handleUpdateMessageStatus(data, client) {
        const user = this.connectedUsers.get(client.id);
        if (!user)
            return;
        try {
            await this.chatService.updateMessageStatus(data.messageId, user.id, data.status);
            const message = await this.chatService.getConversationMessages(data.conversationId, user.id, 1, 1);
            if (message.messages.length > 0) {
                const conversationId = message.messages[0].conversationId;
                this.server.to(conversationId).emit('messageStatusUpdate', {
                    messageId: data.messageId,
                    userId: user.id,
                    status: data.status,
                    timestamp: new Date(),
                });
            }
        }
        catch (error) {
            this.logger.error(`Failed to update message status: ${error.message}`);
            client.emit('error', {
                message: 'Failed to update message status.',
                details: error.message
            });
        }
    }
    async handleShareFile(data, client) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit('error', { message: 'Unauthorized. Please reconnect.' });
            return;
        }
        try {
            const sendMessageDto = {
                conversationId: data.conversationId,
                content: data.message || 'Shared a file',
                type: 'FILE',
                attachmentId: data.fileId,
            };
            const message = await this.chatService.sendMessage(sendMessageDto, user);
            this.server.to(data.conversationId).emit('newMessage', message);
            this.logger.log(`File shared by ${user.email} in conversation ${data.conversationId}`);
        }
        catch (error) {
            this.logger.error(`Failed to share file: ${error.message}`);
            client.emit('error', {
                message: 'Failed to share file.',
                details: error.message
            });
        }
    }
    async handleCreateConversation(data, client) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit('error', { message: 'Unauthorized. Please reconnect.' });
            return;
        }
        try {
            const conversation = await this.chatService.createConversation(data, user);
            const socketIds = data.participantIds
                .map(participantId => this.userSockets.get(participantId))
                .filter(Boolean);
            socketIds.forEach(socketId => {
                if (socketId) {
                    this.server.sockets.sockets.get(socketId)?.join(conversation.id);
                }
            });
            this.server.to(conversation.id).emit('conversationCreated', conversation);
            this.logger.log(`Conversation created by ${user.email}: ${conversation.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to create conversation: ${error.message}`);
            client.emit('error', {
                message: 'Failed to create conversation.',
                details: error.message
            });
        }
    }
    async handleGetOnlineStatus(data, client) {
        const onlineStatuses = data.userIds.map(userId => ({
            userId,
            isOnline: this.userSockets.has(userId),
            lastSeen: new Date(),
        }));
        client.emit('onlineStatuses', onlineStatuses);
    }
    async notifyContactsOnlineStatus(userId, isOnline) {
        try {
            const conversations = await this.chatService.getUserConversations(userId);
            conversations.conversations.forEach(conversation => {
                const otherParticipants = conversation.participants.filter(p => p.id !== userId);
                otherParticipants.forEach(participant => {
                    const participantSocketId = this.userSockets.get(participant.id);
                    if (participantSocketId) {
                        this.server.to(participantSocketId).emit('contactStatusChange', {
                            userId,
                            isOnline,
                            timestamp: new Date(),
                        });
                    }
                });
            });
        }
        catch (error) {
            this.logger.error(`Failed to notify contacts about status change: ${error.message}`);
        }
    }
    sendNotificationToUser(userId, notification) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.server.to(socketId).emit('notification', notification);
        }
    }
    broadcastToConversation(conversationId, event, data) {
        this.server.to(conversationId).emit(event, data);
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
};
exports.EnhancedChatGateway = EnhancedChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EnhancedChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.MessageBody)('conversationId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveConversation'),
    __param(0, (0, websockets_1.MessageBody)('conversationId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EnhancedChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EnhancedChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateMessageStatus'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleUpdateMessageStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('shareFile'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleShareFile", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleCreateConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineStatus'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EnhancedChatGateway.prototype, "handleGetOnlineStatus", null);
exports.EnhancedChatGateway = EnhancedChatGateway = EnhancedChatGateway_1 = __decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
            credentials: true
        }
    }),
    __metadata("design:paramtypes", [enhanced_chat_service_1.EnhancedChatService])
], EnhancedChatGateway);
//# sourceMappingURL=enhanced-chat.gateway.js.map