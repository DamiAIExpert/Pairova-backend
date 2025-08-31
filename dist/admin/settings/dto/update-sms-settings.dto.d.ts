import { SmsProvider } from '../../../common/enums/sms-provider.enum';
import { SmsStatus } from '../../../common/enums/sms-status.enum';
export declare class UpdateSmsSettingsDto {
    provider: SmsProvider;
    apiKey: string;
    senderId: string;
    country?: string;
    status?: SmsStatus;
}
