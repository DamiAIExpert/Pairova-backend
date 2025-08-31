// src/admin/settings/email-settings.service.ts
import { Injectable } from '@nestjs/common';
import { SettingsService } from './settings.service';

/**
 * @class EmailSettingsService
 * @description This class is a proxy to the main SettingsService for email-related settings.
 * It is kept for structural consistency but delegates all logic.
 */
@Injectable()
export class EmailSettingsService {
  constructor(private readonly settingsService: SettingsService) {}

  get() {
    return this.settingsService.getEmailSettings();
  }

  set(dto: any, admin: any) {
    return this.settingsService.upsertEmailSettings(dto, admin);
  }
}
