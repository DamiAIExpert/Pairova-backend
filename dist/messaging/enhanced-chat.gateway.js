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
const auth_service_1 = require("../auth/auth.service");
const message_entity_1 = require("./entities/message.entity");
const email_service_1 = require("../notifications/email.service");
let EnhancedChatGateway = EnhancedChatGateway_1 = class EnhancedChatGateway {
    chatService;
    authService;
    emailService;
    server;
    logger = new common_1.Logger(EnhancedChatGateway_1.name);
    connectedUsers = new Map();
    userSockets = new Map();
    constructor(chatService, authService, emailService) {
        this.chatService = chatService;
        this.authService = authService;
        this.emailService = emailService;
    }
    async handleConnection(client) {
        const authToken = client.handshake?.auth?.token ||
            this.extractBearer(client.handshake?.headers?.authorization) ||
            client.handshake?.query?.token;
        if (!authToken) {
            this.logger.warn(`Client ${client.id} failed to connect: No token provided.`);
            client.disconnect(true);
            return;
        }
        try {
            const user = await this.authService.verifyUserFromToken(authToken);
            client.user = user;
            this.connectedUsers.set(client.id, user);
            this.userSockets.set(user.id, client.id);
            client.join(user.id);
            this.logger.log(`Client connected: ${user.email} (${client.id})`);
            this.notifyContactsOnlineStatus(user.id, true);
        }
        catch (error) {
            this.logger.warn(`Client ${client.id} authentication failed: ${error?.message ?? 'Unknown error'}`);
            client.disconnect(true);
        }
    }
    extractBearer(header) {
        if (!header)
            return undefined;
        const [scheme, token] = header.split(' ');
        if (scheme?.toLowerCase() === 'bearer' && token)
            return token;
        return undefined;
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
            client.emit('newMessage', message);
            const conversationEntity = await this.chatService.getConversationEntity(sendMessageDto.conversationId);
            const offlineRecipients = conversationEntity.participants
                .filter(p => p.userId !== sender.id && !this.userSockets.has(p.userId))
                .map(p => ({
                id: p.userId,
                email: p.user.email,
                profile: {
                    firstName: p.user.applicantProfile?.firstName,
                    lastName: p.user.applicantProfile?.lastName,
                    orgName: p.user.nonprofitOrg?.orgName,
                },
            }));
            if (offlineRecipients.length > 0) {
                const conversation = await this.chatService.getConversation(sendMessageDto.conversationId, sender.id);
                this.sendEmailNotificationsToOfflineUsers(offlineRecipients, message, sender, conversation).catch(err => {
                    this.logger.error(`Failed to send email notifications: ${err.message}`);
                });
            }
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
                type: message_entity_1.MessageType.FILE,
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
    async sendEmailNotificationsToOfflineUsers(offlineRecipients, message, sender, conversation) {
        const senderName = sender.nonprofitOrg?.orgName ||
            (sender.applicantProfile ? `${sender.applicantProfile.firstName} ${sender.applicantProfile.lastName}`.trim() : sender.email) ||
            sender.email;
        for (const recipient of offlineRecipients) {
            try {
                const recipientName = recipient.profile?.orgName ||
                    (recipient.profile?.firstName && recipient.profile?.lastName
                        ? `${recipient.profile.firstName} ${recipient.profile.lastName}`.trim()
                        : recipient.email) ||
                    recipient.email;
                const conversationTitle = conversation.title || `Conversation with ${senderName}`;
                const messagePreview = message.content || 'New message';
                const messageUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/non-profit/messages?conversationId=${conversation.id}`;
                await this.emailService.sendFromTemplate(recipient.email, `New message from ${senderName} on Pairova`, 'new-message', {
                    recipientName,
                    senderName,
                    conversationTitle,
                    messagePreview,
                    messageUrl,
                    timestamp: new Date().toLocaleString(),
                });
                this.logger.log(`Email notification sent to ${recipient.email} for new message from ${sender.email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send email notification to ${recipient.email}: ${error.message}`);
            }
        }
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
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: {
            origin: (origin, callback) => {
                const nodeEnv = process.env.NODE_ENV || 'development';
                let allowedOrigins = [];
                if (nodeEnv === 'development' || nodeEnv === 'dev') {
                    allowedOrigins = [
                        'http://localhost:5173',
                        'http://localhost:3000',
                        'http://localhost:3001',
                        'http://127.0.0.1:5173',
                    ];
                }
                else {
                    const clientUrl = process.env.CLIENT_URL;
                    if (clientUrl) {
                        allowedOrigins.push(...clientUrl.split(',').map(url => url.trim()));
                    }
                    const adminUrl = process.env.ADMIN_URL;
                    if (adminUrl) {
                        allowedOrigins.push(...adminUrl.split(',').map(url => url.trim()));
                    }
                    if (allowedOrigins.length === 0) {
                        allowedOrigins = ['https://pairova.com', 'https://admin.pairova.com'];
                    }
                }
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }
    }),
    __metadata("design:paramtypes", [enhanced_chat_service_1.EnhancedChatService,
        auth_service_1.AuthService,
        email_service_1.EmailService])
], EnhancedChatGateway);
//# sourceMappingURL=enhanced-chat.gateway.js.map