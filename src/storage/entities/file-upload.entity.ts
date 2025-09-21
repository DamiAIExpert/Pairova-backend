// src/storage/entities/file-upload.entity.ts
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
import { StorageProvider } from './storage-provider.entity';
import { User } from '../../users/shared/user.entity';
import { FileType } from '../../common/enums/file-type.enum';

@Entity('file_uploads')
@Index(['userId', 'createdAt'])
@Index(['storageProviderId', 'createdAt'])
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalFilename: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'enum', enum: FileType })
  fileType: FileType;

  @Column({ nullable: true })
  folder: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  publicId: string; // Cloudinary public ID or S3 key

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  storageProviderId: string;

  @ManyToOne(() => StorageProvider)
  @JoinColumn({ name: 'storageProviderId' })
  storageProvider: StorageProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
