// src/notifications/reminder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reminder } from './entities/reminder.entity';
import { ChannelType } from '../common/enums/channel-type.enum';
import { User } from '../users/shared/user.entity';

/**
 * Manages the creation and retrieval of scheduled reminders in the database.
 * A separate scheduler/worker should dispatch due reminders.
 */
@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  /**
   * Creates a reminder record in the database to be processed later by a scheduler.
   */
  async scheduleReminder(
    user: User,
    channel: ChannelType,
    subject: string,
    payload: Record<string, any>,
    scheduledAt: Date,
  ): Promise<Reminder> {
    const reminder = this.reminderRepository.create({
      userId: user.id,
      channel,
      subject,
      payload,
      scheduledAt,
    });

    await this.reminderRepository.save(reminder);

    this.logger.log(
      `Scheduled a ${channel} reminder for user ${user.id} at ${scheduledAt.toISOString()}`,
    );

    return reminder;
  }
}
