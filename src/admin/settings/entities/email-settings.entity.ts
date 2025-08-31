// src/admin/settings/entities/email-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ProviderType } from '../../../common/enums/provider-type.enum';

/**
 * @class EmailSettings
 * @description Represents the configuration for an email provider (e.g., SMTP).
 * Sensitive information like passwords should be encrypted at rest.
 */
@Entity('email_settings')
export class EmailSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ProviderType, default: ProviderType.SMTP })
  provider: ProviderType;

  @Column({ name: 'smtp_host', length: 255, nullable: true })
  smtpHost: string;

  @Column({ name: 'smtp_port', nullable: true })
  smtpPort: number;

  @Column({ length: 255, nullable: true })
  username: string;

  @Column({ name: 'password_enc', type: 'text', nullable: true, comment: 'Encrypted password/API key' })
  passwordEnc: string;

  @Column({ name: 'from_address', length: 255 })
  fromAddress: string;

  @Column({ name: 'secure_tls', default: true })
  secureTls: boolean;

  @Column({ name: 'testing_mode', default: false })
  testingMode: boolean;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
