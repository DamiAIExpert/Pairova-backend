// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reminder } from './entities/reminder.entity';
import { Notification } from './entities/notification.entity';
import { NotificationPreferences } from './entities/notification-preferences.entity';
import { ReminderService } from './reminder.service';
import { EmailService } from './email.service';
import { NotificationService } from './notification.service';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, Notification, NotificationPreferences])],
  controllers: [NotificationsController],
  providers: [ReminderService, EmailService, NotificationService, NotificationPreferencesService],
  exports: [ReminderService, EmailService, NotificationService, NotificationPreferencesService, TypeOrmModule],
})
export class NotificationsModule {}
