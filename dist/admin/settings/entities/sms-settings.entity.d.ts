import { SmsProvider } from '../../../common/enums/sms-provider.enum';
import { SmsStatus } from '../../../common/enums/sms-status.enum';
export declare class SmsSettings {
    id: string;
    provider: SmsProvider;
    apiKeyEnc: string;
    senderId: string;
    country: string;
    priority: number;
    status: SmsStatus;
    testingMode: boolean;
    createdBy: string;
    createdAt: Date;
}
