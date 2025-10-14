export declare enum SmsProviderType {
    TWILIO = "TWILIO",
    CLICKATELL = "CLICKATELL",
    MSG91 = "MSG91",
    NEXMO = "NEXMO",
    AFRICASTALKING = "AFRICASTALKING",
    CM_COM = "CM_COM",
    TELESIGN = "TELESIGN"
}
export declare enum SmsProviderStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    MAINTENANCE = "MAINTENANCE",
    ERROR = "ERROR"
}
export interface SmsProviderConfig {
    apiKey?: string;
    apiSecret?: string;
    accountSid?: string;
    authToken?: string;
    fromNumber?: string;
    fromName?: string;
    twilio?: {
        accountSid: string;
        authToken: string;
        fromNumber: string;
    };
    clickatell?: {
        apiKey: string;
        fromNumber?: string;
    };
    msg91?: {
        authKey: string;
        senderId: string;
        route: string;
    };
    nexmo?: {
        apiKey: string;
        apiSecret: string;
        fromName: string;
    };
    africastalking?: {
        username: string;
        apiKey: string;
        fromNumber?: string;
    };
    cmCom?: {
        apiKey: string;
        fromName: string;
    };
    telesign?: {
        customerId: string;
        apiKey: string;
        fromNumber?: string;
    };
}
export declare class SmsProvider {
    id: string;
    providerType: SmsProviderType;
    status: SmsProviderStatus;
    name: string;
    description: string | null;
    configuration: SmsProviderConfig;
    isActive: boolean;
    priority: number;
    isEnabled: boolean;
    costPerSms: number | null;
    currency: string;
    supportedCountries: string[];
    supportedFeatures: string[];
    lastHealthCheck: Date | null;
    isHealthy: boolean;
    totalSent: number;
    totalDelivered: number;
    deliveryRate: number;
    totalErrors: number;
    lastError: string | null;
    lastUsed: Date | null;
    metadata: {
        website?: string;
        documentation?: string;
        supportEmail?: string;
        rateLimits?: {
            perMinute?: number;
            perHour?: number;
            perDay?: number;
        };
        features?: {
            supportsUnicode?: boolean;
            supportsDeliveryReports?: boolean;
            supportsBulkSms?: boolean;
            supportsScheduling?: boolean;
        };
    } | null;
    createdAt: Date;
    updatedAt: Date;
}
