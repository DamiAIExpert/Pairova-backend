import { ProviderType } from '../../../common/enums/provider-type.enum';
export declare class UpdateEmailSettingsDto {
    provider?: ProviderType;
    smtpHost?: string;
    smtpPort?: number;
    username?: string;
    password?: string;
    fromAddress: string;
    secureTls?: boolean;
    testingMode?: boolean;
}
