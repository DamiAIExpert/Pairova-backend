// src/admin/settings/contact-settings.service.ts
import { Injectable } from '@nestjs/common';
import { SettingsService } from './settings.service';

/**
 * @class ContactSettingsService
 * @description This class is a proxy to the main SettingsService for contact-related settings.
 * It is kept for structural consistency but delegates all logic.
 */
@Injectable()
export class ContactSettingsService {
  constructor(private readonly settingsService: SettingsService) {}

  get() {
    return this.settingsService.getContactSettings();
  }

  set(dto: any, admin: any) {
    // In a real app, this would call an upsert method in the main SettingsService
    console.log('Updating contact settings (simulation):', { dto, adminId: admin.id });
    return this.settingsService.getContactSettings(); // Return current state
  }
}
