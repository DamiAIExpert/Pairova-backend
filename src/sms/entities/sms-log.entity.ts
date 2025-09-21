import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SmsProvider } from './sms-provider.entity';

/**
 * @enum SmsStatus
 * @description SMS delivery status
 */
export enum SmsStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * @enum SmsType
 * @description SMS message type
 */
export enum SmsType {
  VERIFICATION = 'VERIFICATION',
  NOTIFICATION = 'NOTIFICATION',
  MARKETING = 'MARKETING',
  ALERT = 'ALERT',
  REMINDER = 'REMINDER',
  SYSTEM = 'SYSTEM',
}

/**
 * @class SmsLog
 * @description Entity for logging SMS messages and delivery status
 */
@Entity('sms_logs')
@Index(['recipient'])
@Index(['status'])
@Index(['providerId'])
@Index(['createdAt'])
export class SmsLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  providerId: string;

  @ManyToOne(() => SmsProvider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: SmsProvider;

  @Column({ type: 'varchar', length: 20 })
  recipient: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: SmsType,
    default: SmsType.NOTIFICATION,
  })
  type: SmsType;

  @Column({
    type: 'enum',
    enum: SmsStatus,
    default: SmsStatus.PENDING,
  })
  status: SmsStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerMessageId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerReference: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  cost: number | null;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  errorCode: string | null;

  @Column({ type: 'jsonb', nullable: true })
  providerResponse: any;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  deliveredAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  failedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null; // User who triggered the SMS

  @Column({ type: 'varchar', length: 255, nullable: true })
  campaignId: string | null; // For bulk SMS campaigns

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    source?: string; // 'admin_panel', 'api', 'system', etc.
    retryCount?: number;
    originalMessage?: string; // If message was modified
  } | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
