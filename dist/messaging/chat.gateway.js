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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const ws_jwt_guard_1 = require("../auth/strategies/ws-jwt.guard");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    connectedUsers = new Map();
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
        client.join(user.id);
        this.logger.log(`Client connected: ${user.email ?? user.id} (${client.id})`);
    }
    handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            this.logger.log(`Client disconnected: ${user.email ?? user.id} (${client.id})`);
            this.connectedUsers.delete(client.id);
        }
        else {
            this.logger.log(`Client disconnected: (unknown user) (${client.id})`);
        }
    }
    async handleMessage(createMessageDto, client) {
        const sender = this.connectedUsers.get(client.id);
        if (!sender) {
            client.emit('error', { message: 'Unauthorized. Please reconnect.' });
            return;
        }
        try {
            const message = await this.chatService.createMessage(createMessageDto, sender);
            this.server.to(createMessageDto.conversationId).emit('newMessage', message);
        }
        catch (err) {
            const msg = err?.message ?? 'Unknown error';
            this.logger.error(`Failed to handle message: ${msg}`);
            client.emit('error', { message: 'Failed to send message.', details: msg });
        }
    }
    handleJoinConversation(conversationId, client) {
        if (!conversationId) {
            client.emit('error', { message: 'conversationId is required' });
            return;
        }
        client.join(conversationId);
        this.logger.log(`Client ${client.id} joined conversation ${conversationId}`);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.MessageBody)('conversationId')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinConversation", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.WebSocketGateway)({ namespace: '/chat', cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map