import { Repository } from 'typeorm';
import { EmailSettings } from './entities/email-settings.entity';
import { SmsSettings } from './entities/sms-settings.entity';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { UpdateSmsSettingsDto } from './dto/update-sms-settings.dto';
import { User } from '../../users/shared/user.entity';
export declare class SettingsService {
    private readonly emailSettingsRepository;
    private readonly smsSettingsRepository;
    constructor(emailSettingsRepository: Repository<EmailSettings>, smsSettingsRepository: Repository<SmsSettings>);
    getEmailSettings(): Promise<EmailSettings[]>;
    upsertEmailSettings(dto: UpdateEmailSettingsDto, admin: User): Promise<EmailSettings>;
    getSmsSettings(): Promise<SmsSettings[]>;
    upsertSmsSettings(dto: UpdateSmsSettingsDto, admin: User): Promise<SmsSettings>;
    getContactSettings(): Promise<{
        email: string;
        phone: string;
        address: string;
    }>;
}
