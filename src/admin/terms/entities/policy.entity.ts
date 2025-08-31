// src/admin/terms/entities/policy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { PolicyType } from '../../../common/enums/policy-type.enum';

/**
 * @class Policy
 * @description Represents a legal policy document, such as Terms of Service or Privacy Policy.
 */
@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PolicyType, unique: true })
  type: PolicyType;

  @Column({ length: 32 })
  version: string;

  @Column('jsonb', { comment: 'The rich content of the policy document' })
  content: Record<string, any>;

  @Column({ name: 'effective_at', type: 'timestamptz' })
  effectiveAt: Date;

  @Column({ name: 'published_by', type: 'uuid' })
  publishedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
