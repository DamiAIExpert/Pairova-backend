// src/profiles/certifications/entities/certification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/shared/user.entity';

/**
 * @class Certification
 * @description Represents a professional certification belonging to a user, mapped to the `certifications` table.
 */
@Entity('certifications')
export class Certification {
  /**
   * @property id
   * @description The unique identifier for the certification (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @property userId
   * @description The UUID of the user who owns this certification. Foreign key to the `users` table.
   */
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  applicantId: string;

  /**
   * @property user
   * @description The user entity associated with this certification.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * @property name
   * @description The official name of the certification.
   */
  @Column({ length: 255 })
  name: string;

  /**
   * @property issuer
   * @description The organization or entity that issued the certification.
   */
  @Column({ length: 255, nullable: true })
  issuer: string;

  /**
   * @property issueDate
   * @description The date when the certification was issued.
   */
  @Column({ type: 'date', nullable: true })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  issuedDate: Date;

  /**
   * @property credentialUrl
   * @description A URL to a verifiable credential or more information about the certification.
   */
  @Column('text', { nullable: true })
  credentialUrl: string;

  /**
   * @property createdAt
   * @description The timestamp when the certification record was created.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

