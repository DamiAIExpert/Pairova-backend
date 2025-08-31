// src/notifications/entities/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { NotificationType } from '../../common/enums/notification-type.enum';

/**
 * @class Notification
 * @description Represents an in-app notification sent to a user.
 */
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

