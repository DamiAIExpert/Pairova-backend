// src/admin/settings/entities/sms-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { SmsProvider } from '../../../common/enums/sms-provider.enum';
import { SmsStatus } from '../../../common/enums/sms-status.enum';

/**
 * @class SmsSettings
 * @description Represents the configuration for an SMS provider like Twilio, Termii, etc.
 */
@Entity('sms_settings')
export class SmsSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SmsProvider })
  provider: SmsProvider;

  @Column({ name: 'api_key_enc', type: 'text', comment: 'Encrypted API Key/Secret' })
  apiKeyEnc: string;

  @Column({ name: 'sender_id', length: 32 })
  senderId: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ default: 1 })
  priority: number;

  @Column({ type: 'enum', enum: SmsStatus, default: SmsStatus.INACTIVE })
  status: SmsStatus;

  @Column({ name: 'testing_mode', default: false })
  testingMode: boolean;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
