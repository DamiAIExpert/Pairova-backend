// src/admin/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailSettings } from './entities/email-settings.entity';
import { SmsSettings } from './entities/sms-settings.entity';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { UpdateSmsSettingsDto } from './dto/update-sms-settings.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class SettingsService
 * @description Handles the business logic for managing platform-wide settings like email and SMS providers.
 */
@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(EmailSettings)
    private readonly emailSettingsRepository: Repository<EmailSettings>,
    @InjectRepository(SmsSettings)
    private readonly smsSettingsRepository: Repository<SmsSettings>,
  ) {}

  // NOTE: In a real-world application, passwords and API keys should be encrypted before saving.
  // For simplicity, this implementation saves them as provided.

  async getEmailSettings(): Promise<EmailSettings[]> {
    return this.emailSettingsRepository.find();
  }

  /**
   * Updates or creates an email setting configuration.
   * @param dto - The data for the email settings.
   * @param admin - The admin user performing the action.
   * @returns {Promise<EmailSettings>} The updated or created email setting.
   */
  async upsertEmailSettings(dto: UpdateEmailSettingsDto, admin: User): Promise<EmailSettings> {
    let settings = await this.emailSettingsRepository.findOne({ where: { provider: dto.provider } });

    if (settings) {
      // Update existing settings
      Object.assign(settings, { ...dto, passwordEnc: dto.password });
    } else {
      // Create new settings
      settings = this.emailSettingsRepository.create({
        ...dto,
        passwordEnc: dto.password,
        createdBy: admin.id,
      });
    }
    return this.emailSettingsRepository.save(settings);
  }

  async getSmsSettings(): Promise<SmsSettings[]> {
    return this.smsSettingsRepository.find();
  }

  /**
   * Updates or creates an SMS setting configuration.
   * @param dto - The data for the SMS settings.
   * @param admin - The admin user performing the action.
   * @returns {Promise<SmsSettings>} The updated or created SMS setting.
   */
  async upsertSmsSettings(dto: UpdateSmsSettingsDto, admin: User): Promise<SmsSettings> {
    let settings = await this.smsSettingsRepository.findOne({ where: { provider: dto.provider } });

    if (settings) {
      // Update existing settings
      Object.assign(settings, { ...dto, apiKeyEnc: dto.apiKey });
    } else {
      // Create new settings
      settings = this.smsSettingsRepository.create({
        ...dto,
        apiKeyEnc: dto.apiKey,
        createdBy: admin.id,
      });
    }
    return this.smsSettingsRepository.save(settings);
  }
  
  /**
   * Retrieves static contact settings.
   * In a real-world application, this might come from a database table.
   * @returns {Promise<object>}
   */
  async getContactSettings() {
    return {
      email: 'contact@pairova.com',
      phone: '+1-800-555-PAIROVA',
      address: '123 Innovation Drive, Lagos, Nigeria'
    };
  }
}

