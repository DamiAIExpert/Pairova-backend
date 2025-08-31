// src/messaging/entities/conversation-participant.entity.ts
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';

/**
 * @class ConversationParticipant
 * @description Junction table to link users to conversations.
 */
@Entity('conversation_participants')
export class ConversationParticipant {
  @PrimaryColumn({ type: 'uuid' })
  conversationId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Conversation, (c) => c.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamptz', nullable: true })
  lastReadAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'joined_at' })
  joinedAt: Date;
}
