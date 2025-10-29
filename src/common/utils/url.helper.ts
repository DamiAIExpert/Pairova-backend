import { ConfigService } from '@nestjs/config';

/**
 * URL Helper for dynamic frontend URL resolution
 * Supports multiple environments and domains
 */
export class UrlHelper {
  /**
   * Get the appropriate frontend URL based on environment
   * @param configService - NestJS ConfigService
   * @param preferAdmin - Whether to prefer admin URL if available
   * @returns The frontend URL to use
   */
  static getFrontendUrl(configService: ConfigService, preferAdmin = false): string {
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    
    // Development environment
    if (nodeEnv === 'development' || nodeEnv === 'dev') {
      return configService.get<string>('CLIENT_URL') || 'http://localhost:5173';
    }
    
    // Production environment
    if (preferAdmin) {
      const adminUrl = configService.get<string>('ADMIN_URL');
      if (adminUrl) return adminUrl;
    }
    
    return configService.get<string>('CLIENT_URL') || 'https://pairova.com';
  }

  /**
   * Get all allowed frontend URLs for CORS
   * @param configService - NestJS ConfigService
   * @returns Array of allowed URLs
   */
  static getAllowedOrigins(configService: ConfigService): string[] {
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    
    // Development: Allow localhost on various ports
    if (nodeEnv === 'development' || nodeEnv === 'dev') {
      return [
        'http://localhost:5173',  // Vite default
        'http://localhost:3000',  // Alternative
        'http://localhost:3001',  // Alternative
        'http://127.0.0.1:5173',
      ];
    }
    
    // Production: Get from environment variables
    const origins: string[] = [];
    
    const clientUrl = configService.get<string>('CLIENT_URL');
    if (clientUrl) {
      // Support comma-separated URLs
      origins.push(...clientUrl.split(',').map(url => url.trim()));
    }
    
    const adminUrl = configService.get<string>('ADMIN_URL');
    if (adminUrl) {
      origins.push(...adminUrl.split(',').map(url => url.trim()));
    }
    
    // Fallback
    if (origins.length === 0) {
      origins.push('https://pairova.com', 'https://admin.pairova.com');
    }
    
    return origins;
  }

  /**
   * Generate verification link with dynamic URL
   * @param configService - NestJS ConfigService
   * @param email - User email
   * @param code - Verification code
   * @param isAdmin - Whether this is for admin user
   * @returns Complete verification URL
   */
  static generateVerificationLink(
    configService: ConfigService,
    email: string,
    code: string,
    isAdmin = false,
  ): string {
    const frontendUrl = this.getFrontendUrl(configService, isAdmin);
    return `${frontendUrl}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
  }

  /**
   * Generate OAuth callback URL with dynamic URL
   * @param configService - NestJS ConfigService
   * @param accessToken - Access token
   * @param refreshToken - Refresh token
   * @param isAdmin - Whether this is for admin user
   * @returns Complete OAuth callback URL
   */
  static generateOAuthCallbackUrl(
    configService: ConfigService,
    accessToken: string,
    refreshToken: string,
    isAdmin = false,
  ): string {
    const frontendUrl = this.getFrontendUrl(configService, isAdmin);
    return `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
  }

  /**
   * Get the appropriate redirect URL based on user role
   * @param configService - NestJS ConfigService
   * @param role - User role
   * @returns Frontend URL based on role
   */
  static getFrontendUrlByRole(configService: ConfigService, role: string): string {
    const isAdmin = role === 'admin' || role === 'ADMIN';
    return this.getFrontendUrl(configService, isAdmin);
  }
}



