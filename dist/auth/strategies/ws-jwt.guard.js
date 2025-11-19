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
var WsJwtGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
let WsJwtGuard = WsJwtGuard_1 = class WsJwtGuard {
    authService;
    logger = new common_1.Logger(WsJwtGuard_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const authToken = client.handshake?.auth?.token ||
            extractBearer(client.handshake?.headers?.authorization) ||
            extractBearer(client.handshake?.headers?.['authorization']) ||
            client.handshake?.query?.token;
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
            client.user = user;
            this.logger.debug(`Client ${client.id} authenticated as user ${user.email}`);
            return true;
        }
        catch (error) {
            this.logger.warn(`Client ${client.id} authentication failed: ${error?.message ?? 'Unknown error'}`, error?.stack);
            return false;
        }
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = WsJwtGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], WsJwtGuard);
function extractBearer(header) {
    if (!header)
        return undefined;
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token)
        return token;
    return undefined;
}
//# sourceMappingURL=ws-jwt.guard.js.map