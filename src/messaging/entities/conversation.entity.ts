// src/messaging/entities/conversation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'created_by', nullable: true })
  createdByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column('uuid', { name: 'related_job_id', nullable: true })
  relatedJobId: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'related_job_id' })
  relatedJob: Job;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(
    () => ConversationParticipant,
    (participant) => participant.conversation,
  )
  participants: ConversationParticipant[];

  @Column({ type: 'boolean', default: false })
  isGroup: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

