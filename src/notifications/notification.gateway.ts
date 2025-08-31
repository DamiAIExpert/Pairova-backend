// src/notifications/notification.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/shared/user.entity';

/**
 * @class NotificationGateway
 * @description Handles real-time, in-app notifications via WebSockets.
 * It manages client connections, authenticates users via JWT, and provides
 * a method to push targeted notifications to specific users.
 */
@WebSocketGateway({
  namespace: '/notify',
  cors: {
    origin: '*', // In production, restrict this to your frontend's domain
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private clients: Map<string, Socket> = new Map();

  constructor(private readonly authService: AuthService) {}

  /**
   * Handles a new client connection.
   * Authenticates the user via the JWT provided in the handshake.
   * If authentication is successful, the client is tracked for targeted notifications.
   * If it fails, the connection is terminated.
   *
   * @param client - The connecting socket client.
   */
  async handleConnection(client: Socket) {
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
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect(true);
    }
  }

  /**
   * Handles a client disconnection.
   * Removes the client from the tracking map to prevent memory leaks.
   *
   * @param client - The disconnecting socket client.
   */
  handleDisconnect(client: Socket) {
    // Find the user ID associated with the disconnected socket and remove it
    for (const [userId, socket] of this.clients.entries()) {
      if (socket.id === client.id) {
        this.clients.delete(userId);
        this.logger.log(`Client disconnected: ${client.id} (User ID: ${userId})`);
        break;
      }
    }
  }

  /**
   * Sends a notification to a specific, connected user.
   *
   * @param userId - The ID of the user to notify.
   * @param event - The event name for the notification (e.g., 'new_message', 'application_update').
   * @param data - The payload of the notification.
   */
  sendNotificationToUser(userId: string, event: string, data: any): void {
    const clientSocket = this.clients.get(userId);
    if (clientSocket) {
      clientSocket.emit(event, data);
      this.logger.log(`Sent '${event}' notification to user ${userId}`);
    } else {
      this.logger.warn(
        `Attempted to send notification to user ${userId}, but they are not connected.`,
      );
    }
  }
}

