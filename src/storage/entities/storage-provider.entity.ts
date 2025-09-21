// src/storage/entities/storage-provider.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StorageType } from '../../common/enums/storage-type.enum';
import { FileUpload } from './file-upload.entity';

@Entity('storage_providers')
export class StorageProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: StorageType })
  type: StorageType;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 1 })
  priority: number;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'bigint', default: 0 })
  totalStorageUsed: number; // in bytes

  @Column({ default: true })
  isHealthy: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastHealthCheck: Date;

  @Column({ type: 'text', nullable: true })
  healthCheckError: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FileUpload, (file) => file.storageProvider)
  files: FileUpload[];
}
