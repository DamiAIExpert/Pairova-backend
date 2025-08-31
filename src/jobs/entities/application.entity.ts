// src/jobs/entities/application.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicationStatus } from '../../common/enums/job.enum';
import { Upload } from '../../profiles/uploads/entities/upload.entity';

/**
 * @class Application
 * @description Represents a job application submitted by an applicant for a specific job.
 */
@Entity('applications')
@Unique(['jobId', 'applicantId'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  jobId: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'uuid' })
  applicantId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column('text', { nullable: true })
  coverLetter: string | null;

  @Column({ type: 'uuid', nullable: true })
  resumeUploadId: string | null;

  @ManyToOne(() => Upload, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resume_upload_id' })
  resume: Upload | null;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  matchScore: number | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'applied_at' })
  appliedAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
