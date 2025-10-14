import { SmsProviderType } from '../entities/sms-provider.entity';
export interface SmsProviderInterface {
    sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
    validateConfiguration(config: any): Promise<boolean>;
    getHealthStatus(): Promise<SmsHealthStatus>;
    getBalance?(): Promise<number>;
    getDeliveryStatus?(messageId: string): Promise<SmsDeliveryStatus>;
}
export interface SmsSendResult {
    success: boolean;
    messageId?: string;
    providerReference?: string;
    cost?: number;
    currency?: string;
    error?: string;
    errorCode?: string;
}
export interface SmsHealthStatus {
    isHealthy: boolean;
    responseTime?: number;
    error?: string;
    balance?: number;
    lastChecked: Date;
}
export interface SmsDeliveryStatus {
    messageId: string;
    status: 'sent' | 'delivered' | 'failed' | 'unknown';
    deliveredAt?: Date;
    error?: string;
}
export declare class TwilioSmsProvider implements SmsProviderInterface {
    private config;
    private readonly logger;
    private twilio;
    constructor(config: any);
    sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
    validateConfiguration(config: any): Promise<boolean>;
    getHealthStatus(): Promise<SmsHealthStatus>;
    getDeliveryStatus(messageId: string): Promise<SmsDeliveryStatus>;
}
export declare class ClickatellSmsProvider implements SmsProviderInterface {
    private config;
    private readonly logger;
    constructor(config: any);
    sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
    validateConfiguration(config: any): Promise<boolean>;
    getHealthStatus(): Promise<SmsHealthStatus>;
}
export declare class Msg91SmsProvider implements SmsProviderInterface {
    private config;
    private readonly logger;
    constructor(config: any);
    sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
    validateConfiguration(config: any): Promise<boolean>;
    getHealthStatus(): Promise<SmsHealthStatus>;
}
export declare class AfricastalkingSmsProvider implements SmsProviderInterface {
    private config;
    private readonly logger;
    constructor(config: any);
    sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
    validateConfiguration(config: any): Promise<boolean>;
    getHealthStatus(): Promise<SmsHealthStatus>;
}
export declare class SmsProviderFactory {
    private readonly logger;
    createProvider(providerType: SmsProviderType, config: any): SmsProviderInterface;
    getSupportedProviders(): SmsProviderType[];
    validateProviderConfig(providerType: SmsProviderType, config: any): Promise<boolean>;
}
