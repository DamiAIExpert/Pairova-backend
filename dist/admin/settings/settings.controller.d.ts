import { SettingsService } from './settings.service';
import { User } from '../../users/shared/user.entity';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { UpdateSmsSettingsDto } from './dto/update-sms-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getEmailSettings(): Promise<import("./entities/email-settings.entity").EmailSettings[]>;
    upsertEmailSettings(dto: UpdateEmailSettingsDto, admin: User): Promise<import("./entities/email-settings.entity").EmailSettings>;
    getSmsSettings(): Promise<import("./entities/sms-settings.entity").SmsSettings[]>;
    upsertSmsSettings(dto: UpdateSmsSettingsDto, admin: User): Promise<import("./entities/sms-settings.entity").SmsSettings>;
}
