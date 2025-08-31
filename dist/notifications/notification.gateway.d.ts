import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private readonly logger;
    private clients;
    constructor(authService: AuthService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendNotificationToUser(userId: string, event: string, data: any): void;
}
