import { ConfigService } from '@nestjs/config';
export declare class UrlHelper {
    static getFrontendUrl(configService: ConfigService, preferAdmin?: boolean): string;
    static getAllowedOrigins(configService: ConfigService): string[];
    static generateVerificationLink(configService: ConfigService, email: string, code: string, isAdmin?: boolean): string;
    static generateOAuthCallbackUrl(configService: ConfigService, accessToken: string, refreshToken: string, isAdmin?: boolean): string;
    static getFrontendUrlByRole(configService: ConfigService, role: string): string;
}
