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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    authService;
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    clients = new Map();
    constructor(authService) {
        this.authService = authService;
    }
    async handleConnection(client) {
        const authHeader = client.handshake.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn(`Connection attempt without token from ${client.id}. Disconnecting.`);
            client.disconnect(true);
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const user = await this.authService.verifyUserFromToken(token);
            if (!user) {
                throw new Error('User not found');
            }
            this.clients.set(user.id, client);
            this.logger.log(`Client connected: ${client.id} (User ID: ${user.id})`);
        }
        catch (error) {
            this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        for (const [userId, socket] of this.clients.entries()) {
            if (socket.id === client.id) {
                this.clients.delete(userId);
                this.logger.log(`Client disconnected: ${client.id} (User ID: ${userId})`);
                break;
            }
        }
    }
    sendNotificationToUser(userId, event, data) {
        const clientSocket = this.clients.get(userId);
        if (clientSocket) {
            clientSocket.emit(event, data);
            this.logger.log(`Sent '${event}' notification to user ${userId}`);
        }
        else {
            this.logger.warn(`Attempted to send notification to user ${userId}, but they are not connected.`);
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/notify',
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map