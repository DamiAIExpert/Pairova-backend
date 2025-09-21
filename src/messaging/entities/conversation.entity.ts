import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Message } from './message.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { User } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';

/**
 * @enum ConversationType
 * @description Types of conversations
 */
export enum ConversationType {
  DIRECT = 'DIRECT', // Direct message between two users
  JOB_RELATED = 'JOB_RELATED', // Conversation related to a specific job
  INTERVIEW = 'INTERVIEW', // Interview-related conversation
  SUPPORT = 'SUPPORT', // Support conversation
}

/**
 * @enum ConversationStatus
 * @description Status of the conversation
 */
export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

/**
 * @class Conversation
 * @description Represents a conversation between users
 */
@Entity('conversations')
@Index(['status', 'createdAt'])
@Index(['type', 'createdAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.DIRECT,
  })
  type: ConversationType;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'uuid', nullable: true })
  jobId: string | null;

  @ManyToOne(() => Job, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'job_id' })
  job: Job | null;

  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User | null;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastMessageAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    applicationId?: string;
    interviewId?: string;
    tags?: string[];
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    category?: string;
  } | null;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => ConversationParticipant, (participant) => participant.conversation)
  participants: ConversationParticipant[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
