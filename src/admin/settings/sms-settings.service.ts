// src/admin/settings/sms-settings.service.ts
import { Injectable } from '@nestjs/common';
import { SettingsService } from './settings.service';

/**
 * @class SmsSettingsService
 * @description This class is a proxy to the main SettingsService for SMS-related settings.
 * It is kept for structural consistency but delegates all logic.
 */
@Injectable()
export class SmsSettingsService {
  constructor(private readonly settingsService: SettingsService) {}

  get() {
    return this.settingsService.getSmsSettings();
  }

  set(dto: any, admin: any) {
    return this.settingsService.upsertSmsSettings(dto, admin);
  }
}
