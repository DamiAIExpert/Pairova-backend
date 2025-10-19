import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/shared/user.entity';

/**
 * @class NotificationPreferences
 * @description Represents user notification preferences
 */
@Entity('notification_preferences')
export class NotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Email notifications
  @Column({ name: 'email_enabled', default: true })
  emailEnabled: boolean;

  @Column({ name: 'email_job_matches', default: true })
  emailJobMatches: boolean;

  @Column({ name: 'email_application_updates', default: true })
  emailApplicationUpdates: boolean;

  @Column({ name: 'email_interviews', default: true })
  emailInterviews: boolean;

  @Column({ name: 'email_messages', default: true })
  emailMessages: boolean;

  @Column({ name: 'email_system', default: true })
  emailSystem: boolean;

  // Push notifications
  @Column({ name: 'push_enabled', default: true })
  pushEnabled: boolean;

  @Column({ name: 'push_job_matches', default: true })
  pushJobMatches: boolean;

  @Column({ name: 'push_application_updates', default: true })
  pushApplicationUpdates: boolean;

  @Column({ name: 'push_interviews', default: true })
  pushInterviews: boolean;

  @Column({ name: 'push_messages', default: true })
  pushMessages: boolean;

  @Column({ name: 'push_system', default: true })
  pushSystem: boolean;

  // SMS notifications
  @Column({ name: 'sms_enabled', default: false })
  smsEnabled: boolean;

  @Column({ name: 'sms_job_matches', default: false })
  smsJobMatches: boolean;

  @Column({ name: 'sms_application_updates', default: false })
  smsApplicationUpdates: boolean;

  @Column({ name: 'sms_interviews', default: true })
  smsInterviews: boolean;

  @Column({ name: 'sms_messages', default: false })
  smsMessages: boolean;

  @Column({ name: 'sms_system', default: false })
  smsSystem: boolean;

  // Reminders
  @Column({ name: 'reminders_enabled', default: true })
  remindersEnabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
