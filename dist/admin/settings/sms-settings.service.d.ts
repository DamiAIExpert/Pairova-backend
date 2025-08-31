import { SettingsService } from './settings.service';
export declare class SmsSettingsService {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<import("./entities/sms-settings.entity").SmsSettings[]>;
    set(dto: any, admin: any): Promise<import("./entities/sms-settings.entity").SmsSettings>;
}
