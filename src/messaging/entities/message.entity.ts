// src/messaging/entities/message.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../users/shared/user.entity';
import { MessageType } from '../../common/enums/message.enum';
import { Upload } from '../../profiles/uploads/entities/upload.entity';

/**
 * @class Message
 * @description Represents a single message within a conversation.
 * Supports text, attachments, and system-generated messages.
 */
@Entity('messages')
export class Message {
  /**
   * Unique identifier for the message.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Foreign key: Conversation this message belongs to.
   */
  @Column({ type: 'uuid', name: 'conversation_id' })
  conversationId: string;

  /**
   * Conversation relationship.
   */
  @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  /**
   * Foreign key: Sender of the message.
   */
  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  /**
   * Sender relationship.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  /**
   * Type of message — TEXT, FILE, IMAGE, SYSTEM, etc.
   */
  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  /**
   * The textual content of the message.
   */
  @Column({ type: 'text', nullable: true })
  content: string | null;

  /**
   * Foreign key: Optional file attachment.
   */
  @Column({ type: 'uuid', nullable: true, name: 'attachment_id' })
  attachmentId: string | null;

  /**
   * Attachment relationship.
   */
  @ManyToOne(() => Upload, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'attachment_id' })
  attachment?: Upload | null;

  /**
   * Timestamp when the message was sent.
   */
  @CreateDateColumn({ type: 'timestamptz', name: 'sent_at' })
  sentAt: Date;

  /**
   * Whether the message is marked as deleted.
   */
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
