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

    // Try multiple ways to get the token
    const authToken =
      (client.handshake?.auth as any)?.token ||
      extractBearer(client.handshake?.headers?.authorization) ||
      extractBearer((client.handshake?.headers as any)?.['authorization']) ||
      (client.handshake?.query?.token as string | undefined);

    if (!authToken) {
      this.logger.warn(`Client ${client.id} failed to connect: No token provided.`, {
        hasAuth: !!client.handshake?.auth,
        authKeys: client.handshake?.auth ? Object.keys(client.handshake.auth) : [],
        hasHeaders: !!client.handshake?.headers,
        headerKeys: client.handshake?.headers ? Object.keys(client.handshake.headers) : [],
        hasQuery: !!client.handshake?.query,
        queryKeys: client.handshake?.query ? Object.keys(client.handshake.query) : [],
      });
      return false;
    }

    try {
      const user = await this.authService.verifyUserFromToken(authToken);
      (client as any).user = user; // attach user to socket
      this.logger.debug(`Client ${client.id} authenticated as user ${user.email}`);
      return true;
    } catch (error: any) {
      this.logger.warn(
        `Client ${client.id} authentication failed: ${error?.message ?? 'Unknown error'}`,
        error?.stack,
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
