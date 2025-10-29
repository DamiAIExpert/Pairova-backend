"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlHelper = void 0;
class UrlHelper {
    static getFrontendUrl(configService, preferAdmin = false) {
        const nodeEnv = configService.get('NODE_ENV', 'development');
        if (nodeEnv === 'development' || nodeEnv === 'dev') {
            return configService.get('CLIENT_URL') || 'http://localhost:5173';
        }
        if (preferAdmin) {
            const adminUrl = configService.get('ADMIN_URL');
            if (adminUrl)
                return adminUrl;
        }
        return configService.get('CLIENT_URL') || 'https://pairova.com';
    }
    static getAllowedOrigins(configService) {
        const nodeEnv = configService.get('NODE_ENV', 'development');
        if (nodeEnv === 'development' || nodeEnv === 'dev') {
            return [
                'http://localhost:5173',
                'http://localhost:3000',
                'http://localhost:3001',
                'http://127.0.0.1:5173',
            ];
        }
        const origins = [];
        const clientUrl = configService.get('CLIENT_URL');
        if (clientUrl) {
            origins.push(...clientUrl.split(',').map(url => url.trim()));
        }
        const adminUrl = configService.get('ADMIN_URL');
        if (adminUrl) {
            origins.push(...adminUrl.split(',').map(url => url.trim()));
        }
        if (origins.length === 0) {
            origins.push('https://pairova.com', 'https://admin.pairova.com');
        }
        return origins;
    }
    static generateVerificationLink(configService, email, code, isAdmin = false) {
        const frontendUrl = this.getFrontendUrl(configService, isAdmin);
        return `${frontendUrl}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
    }
    static generateOAuthCallbackUrl(configService, accessToken, refreshToken, isAdmin = false) {
        const frontendUrl = this.getFrontendUrl(configService, isAdmin);
        return `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    }
    static getFrontendUrlByRole(configService, role) {
        const isAdmin = role === 'admin' || role === 'ADMIN';
        return this.getFrontendUrl(configService, isAdmin);
    }
}
exports.UrlHelper = UrlHelper;
//# sourceMappingURL=url.helper.js.map