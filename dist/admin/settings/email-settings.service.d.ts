import { SettingsService } from './settings.service';
export declare class EmailSettingsService {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<import("./entities/email-settings.entity").EmailSettings[]>;
    set(dto: any, admin: any): Promise<import("./entities/email-settings.entity").EmailSettings>;
}
