// src/auth/strategies/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const authToken =
      (client.handshake?.auth as any)?.token ||
      extractBearer(client.handshake?.headers?.authorization) ||
      (client.handshake?.query?.token as string | undefined);

    if (!authToken) {
      this.logger.warn(`Client ${client.id} failed to connect: No token provided.`);
      return false;
    }

    try {
      const user = await this.authService.verifyUserFromToken(authToken);
      (client as any).user = user; // attach user to socket
      return true;
    } catch (error: any) {
      this.logger.warn(
        `Client ${client.id} authentication failed: ${error?.message ?? 'Unknown error'}`,
      );
      return false;
    }
  }
}

function extractBearer(header?: string): string | undefined {
  if (!header) return undefined;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() === 'bearer' && token) return token;
  return undefined;
}
