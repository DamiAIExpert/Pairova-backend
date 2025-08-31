// src/admin/audit/entities/audit-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../../users/shared/user.entity';
import { AuditAction } from '../../../common/enums/audit-action.enum';

/**
 * @class AuditLog
 * @description Represents an action taken by an administrator that should be logged for security and auditing purposes.
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'uuid', name: 'admin_id' })
  adminId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ name: 'resource_type', length: 64 })
  resourceType: string;

  @Column({ name: 'resource_id', length: 128, nullable: true })
  resourceId: string;

  @Column('text', { nullable: true })
  reason: string;

  @Column('jsonb', { name: 'before_data', nullable: true })
  beforeData: Record<string, any>;

  @Column('jsonb', { name: 'after_data', nullable: true })
  afterData: Record<string, any>;

  @Column({ type: 'inet', name: 'ip_address', nullable: true })
  ipAddress: string;
}
