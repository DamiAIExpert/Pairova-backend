// src/notifications/entities/reminder.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { ChannelType } from '../../common/enums/channel-type.enum';

/**
 * Represents a scheduled reminder/notification to be sent later
 * (via EMAIL, SMS, or IN_APP). A worker/scheduler should pick
 * these up at `scheduledAt`, deliver them, and set `sentAt`.
 */
@Entity('reminders')
@Index(['userId', 'scheduledAt'])
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ChannelType })
  channel: ChannelType;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  // Arbitrary data for template rendering (email/SMS payload)
  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, any>;

  // When the reminder should be sent
  @Column({ type: 'timestamptz', name: 'scheduled_at' })
  scheduledAt: Date;

  // When the reminder was actually sent (null until processed)
  @Column({ type: 'timestamptz', name: 'sent_at', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
