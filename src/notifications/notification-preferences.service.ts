import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreferences } from './entities/notification-preferences.entity';
import { User } from '../users/shared/user.entity';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreferences)
    private readonly preferencesRepository: Repository<NotificationPreferences>,
  ) {}

  /**
   * Get or create notification preferences for a user
   */
  async getOrCreatePreferences(userId: string): Promise<NotificationPreferences> {
    let preferences = await this.preferencesRepository.findOne({
      where: { userId },
    });

    if (!preferences) {
      preferences = this.preferencesRepository.create({
        userId,
      });
      preferences = await this.preferencesRepository.save(preferences);
    }

    return preferences;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    const preferences = await this.getOrCreatePreferences(userId);
    
    Object.assign(preferences, updates);
    
    return this.preferencesRepository.save(preferences);
  }

  /**
   * Get preferences in a simplified format for API responses
   */
  async getPreferencesForApi(userId: string): Promise<{
    email: boolean;
    push: boolean;
    sms: boolean;
    reminders: boolean;
    emailJobMatches: boolean;
    emailApplicationUpdates: boolean;
    emailInterviews: boolean;
    emailMessages: boolean;
    emailSystem: boolean;
    pushJobMatches: boolean;
    pushApplicationUpdates: boolean;
    pushInterviews: boolean;
    pushMessages: boolean;
    pushSystem: boolean;
    smsJobMatches: boolean;
    smsApplicationUpdates: boolean;
    smsInterviews: boolean;
    smsMessages: boolean;
    smsSystem: boolean;
  }> {
    const preferences = await this.getOrCreatePreferences(userId);

    return {
      email: preferences.emailEnabled,
      push: preferences.pushEnabled,
      sms: preferences.smsEnabled,
      reminders: preferences.remindersEnabled,
      emailJobMatches: preferences.emailJobMatches,
      emailApplicationUpdates: preferences.emailApplicationUpdates,
      emailInterviews: preferences.emailInterviews,
      emailMessages: preferences.emailMessages,
      emailSystem: preferences.emailSystem,
      pushJobMatches: preferences.pushJobMatches,
      pushApplicationUpdates: preferences.pushApplicationUpdates,
      pushInterviews: preferences.pushInterviews,
      pushMessages: preferences.pushMessages,
      pushSystem: preferences.pushSystem,
      smsJobMatches: preferences.smsJobMatches,
      smsApplicationUpdates: preferences.smsApplicationUpdates,
      smsInterviews: preferences.smsInterviews,
      smsMessages: preferences.smsMessages,
      smsSystem: preferences.smsSystem,
    };
  }
}
