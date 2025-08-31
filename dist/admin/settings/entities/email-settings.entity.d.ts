import { ProviderType } from '../../../common/enums/provider-type.enum';
export declare class EmailSettings {
    id: string;
    provider: ProviderType;
    smtpHost: string;
    smtpPort: number;
    username: string;
    passwordEnc: string;
    fromAddress: string;
    secureTls: boolean;
    testingMode: boolean;
    createdBy: string;
    createdAt: Date;
}
