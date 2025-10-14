import { SmsProvider } from './sms-provider.entity';
export declare enum SmsStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    UNKNOWN = "UNKNOWN"
}
export declare enum SmsType {
    VERIFICATION = "VERIFICATION",
    NOTIFICATION = "NOTIFICATION",
    MARKETING = "MARKETING",
    ALERT = "ALERT",
    REMINDER = "REMINDER",
    SYSTEM = "SYSTEM"
}
export declare class SmsLog {
    id: string;
    providerId: string;
    provider: SmsProvider;
    recipient: string;
    message: string;
    type: SmsType;
    status: SmsStatus;
    providerMessageId: string | null;
    providerReference: string | null;
    cost: number | null;
    currency: string;
    errorMessage: string | null;
    errorCode: string | null;
    providerResponse: any;
    sentAt: Date | null;
    deliveredAt: Date | null;
    failedAt: Date | null;
    userId: string | null;
    campaignId: string | null;
    metadata: {
        ipAddress?: string;
        userAgent?: string;
        source?: string;
        retryCount?: number;
        originalMessage?: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
}
