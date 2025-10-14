import { SmsProviderType, SmsProviderStatus } from '../entities/sms-provider.entity';
export declare class CreateSmsProviderDto {
    providerType: SmsProviderType;
    name: string;
    description?: string;
    configuration: any;
    isActive?: boolean;
    priority?: number;
    costPerSms?: number;
    currency?: string;
    supportedCountries?: string[];
    supportedFeatures?: string[];
}
export declare class UpdateSmsProviderDto {
    status?: SmsProviderStatus;
    name?: string;
    description?: string;
    configuration?: any;
    isActive?: boolean;
    priority?: number;
    isEnabled?: boolean;
    costPerSms?: number;
    currency?: string;
    supportedCountries?: string[];
    supportedFeatures?: string[];
}
export declare class SmsProviderResponseDto {
    id: string;
    providerType: SmsProviderType;
    status: SmsProviderStatus;
    name: string;
    description?: string;
    isActive: boolean;
    priority: number;
    isEnabled: boolean;
    costPerSms?: number;
    currency: string;
    supportedCountries: string[];
    supportedFeatures: string[];
    lastHealthCheck?: Date;
    isHealthy: boolean;
    totalSent: number;
    totalDelivered: number;
    deliveryRate: number;
    totalErrors: number;
    lastError?: string;
    lastUsed?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SendSmsDto {
    recipient: string;
    message: string;
    type?: string;
    preferredProviderId?: string;
    campaignId?: string;
    metadata?: any;
}
export declare class SmsLogResponseDto {
    id: string;
    providerId: string;
    providerName: string;
    recipient: string;
    message: string;
    type: string;
    status: string;
    providerMessageId?: string;
    cost?: number;
    currency: string;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    failedAt?: Date;
    createdAt: Date;
}
