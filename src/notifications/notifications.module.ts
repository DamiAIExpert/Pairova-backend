// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reminder } from './entities/reminder.entity';
import { ReminderService } from './reminder.service';
import { EmailService } from './email.service';
@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  providers: [ReminderService, EmailService],
  exports: [ReminderService, EmailService, TypeOrmModule],
})
export class NotificationsModule {}
