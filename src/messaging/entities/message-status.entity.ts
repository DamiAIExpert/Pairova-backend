import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/shared/user.entity';

/**
 * @enum MessageStatusType
 * @description Types of message status
 */
export enum MessageStatusType {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

/**
 * @class MessageStatus
 * @description Tracks message delivery and read status for each participant
 */
@Entity('message_status')
@Unique(['messageId', 'userId'])
@Index(['messageId', 'status'])
@Index(['userId', 'status'])
export class MessageStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'message_id' })
  messageId: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: MessageStatusType,
    default: MessageStatusType.SENT,
  })
  status: MessageStatusType;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'updated_at' })
  updatedAt: Date | null;
}
