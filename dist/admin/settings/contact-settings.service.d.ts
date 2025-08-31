import { SettingsService } from './settings.service';
export declare class ContactSettingsService {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<{
        email: string;
        phone: string;
        address: string;
    }>;
    set(dto: any, admin: any): Promise<{
        email: string;
        phone: string;
        address: string;
    }>;
}
