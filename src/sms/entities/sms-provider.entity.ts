import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * @enum SmsProviderType
 * @description Supported SMS provider types
 */
export enum SmsProviderType {
  TWILIO = 'TWILIO',
  CLICKATELL = 'CLICKATELL',
  MSG91 = 'MSG91',
  NEXMO = 'NEXMO',
  AFRICASTALKING = 'AFRICASTALKING',
  CM_COM = 'CM_COM',
  TELESIGN = 'TELESIGN',
}

/**
 * @enum SmsProviderStatus
 * @description SMS provider status
 */
export enum SmsProviderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
}

/**
 * @interface SmsProviderConfig
 * @description Configuration structure for SMS providers
 */
export interface SmsProviderConfig {
  // Common fields
  apiKey?: string;
  apiSecret?: string;
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
  fromName?: string;
  
  // Provider-specific fields
  twilio?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  
  clickatell?: {
    apiKey: string;
    fromNumber?: string;
  };
  
  msg91?: {
    authKey: string;
    senderId: string;
    route: string;
  };
  
  nexmo?: {
    apiKey: string;
    apiSecret: string;
    fromName: string;
  };
  
  africastalking?: {
    username: string;
    apiKey: string;
    fromNumber?: string;
  };
  
  cmCom?: {
    apiKey: string;
    fromName: string;
  };
  
  telesign?: {
    customerId: string;
    apiKey: string;
    fromNumber?: string;
  };
}

/**
 * @class SmsProvider
 * @description Entity for managing SMS provider configurations
 */
@Entity('sms_providers')
@Index(['isActive', 'priority'])
@Index(['providerType'])
export class SmsProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SmsProviderType,
  })
  providerType: SmsProviderType;

  @Column({
    type: 'enum',
    enum: SmsProviderStatus,
    default: SmsProviderStatus.INACTIVE,
  })
  status: SmsProviderStatus;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb' })
  configuration: SmsProviderConfig;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  priority: number; // Lower number = higher priority

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  costPerSms: number | null;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 255, array: true, default: '{}' })
  supportedCountries: string[];

  @Column({ type: 'varchar', length: 255, array: true, default: '{}' })
  supportedFeatures: string[]; // ['bulk', 'unicode', 'delivery_reports', 'scheduling']

  @Column({ type: 'timestamptz', nullable: true })
  lastHealthCheck: Date | null;

  @Column({ type: 'boolean', default: true })
  isHealthy: boolean;

  @Column({ type: 'int', default: 0 })
  totalSent: number;

  @Column({ type: 'int', default: 0 })
  totalDelivered: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  deliveryRate: number;

  @Column({ type: 'int', default: 0 })
  totalErrors: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lastError: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastUsed: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    website?: string;
    documentation?: string;
    supportEmail?: string;
    rateLimits?: {
      perMinute?: number;
      perHour?: number;
      perDay?: number;
    };
    features?: {
      supportsUnicode?: boolean;
      supportsDeliveryReports?: boolean;
      supportsBulkSms?: boolean;
      supportsScheduling?: boolean;
    };
  } | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
