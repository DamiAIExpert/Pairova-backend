// src/messaging/interview/entities/interview.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from '../../../jobs/entities/application.entity';
import { User } from '../../../users/shared/user.entity';

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

/**
 * @class Interview
 * @description Represents a scheduled interview for a job application.
 */
@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'uuid' })
  scheduledById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'scheduled_by' })
  scheduledBy: User;

  @Column({ type: 'timestamptz' })
  startAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endAt: Date;

  @Column('text', { nullable: true })
  meetingLink: string;

  @Column({ type: 'varchar', length: 32, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
