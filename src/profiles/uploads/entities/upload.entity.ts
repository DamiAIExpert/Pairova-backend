// src/profiles/uploads/entities/upload.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/shared/user.entity';

@Entity('uploads')
@Index(['userId', 'kind'])
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Store the FK explicitly for easy querying, and also keep a relation.
  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  // e.g., 'avatar', 'resume', 'certification'
  @Column({ type: 'varchar', length: 64 })
  kind: string;

  // Public URL from Cloudinary (secure_url)
  @Column({ type: 'text' })
  fileUrl: string;

  // Cloudinary public_id (nullable if not applicable)
  @Column({ type: 'varchar', length: 255, nullable: true })
  publicId: string | null;

  // e.g., 'application/pdf', 'image/png'
  @Column({ type: 'varchar', length: 128, nullable: true })
  mimeType: string | null;

  // Use bigint in Postgres to handle large files; map to number in TS
  @Column({ type: 'bigint', nullable: true })
  sizeBytes: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
