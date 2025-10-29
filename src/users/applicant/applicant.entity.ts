import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../shared/user.entity';
import { Gender } from '../../common/enums/gender.enum';

/**
 * @class ApplicantProfile
 * @description Represents the detailed profile for a user with the 'APPLICANT' role.
 * This entity is linked one-to-one with the core User entity and holds all
 * personal and professional information specific to a job seeker.
 */
@Entity('applicant_profiles')
export class ApplicantProfile {
  /**
   * @property {string} userId
   * @description The primary key of the applicant profile. It is also a foreign key
   * referencing the `id` of the `users` table, creating a one-to-one relationship.
   */
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId: string;

  /**
   * @property {User} user
   * @description The associated User entity. The `@JoinColumn` decorator indicates that
   * this side of the relationship owns the foreign key (`user_id`).
   * `onDelete: 'CASCADE'` ensures that if a User is deleted, their associated profile is also deleted.
   */
  @OneToOne(() => User, (user) => user.applicantProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    comment: 'Gender identity of the applicant.',
  })
  gender: Gender;

  @Column({ type: 'date', nullable: true, comment: 'Date of birth.' })
  dob: Date;

  @Column('text', {
    nullable: true,
    comment: 'A short, professional biography of the applicant.',
  })
  bio: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column('text', {
    name: 'photo_url',
    nullable: true,
    comment: 'URL to the applicant profile photo.',
  })
  photoUrl: string;

  @Column('text', {
    name: 'portfolio_url',
    nullable: true,
    comment: 'URL to an external portfolio (e.g., Behance, GitHub).',
  })
  portfolioUrl: string;

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[];

  @Column({ 
    name: 'experience_level',
    type: 'enum', 
    enum: ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'], 
    nullable: true 
  })
  experienceLevel: string;

  @Column({ 
    name: 'preferred_employment_type',
    type: 'enum', 
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP'], 
    nullable: true 
  })
  preferredEmploymentType: string;

  /**
   * Privacy Settings
   * @description Controls how the applicant's data is used across the platform
   */
  
  @Column({ 
    name: 'allow_ai_training',
    type: 'boolean', 
    default: true,
    comment: 'Whether the applicant allows their data to be used for AI model training'
  })
  allowAiTraining: boolean;

  @Column({ 
    name: 'allow_profile_indexing',
    type: 'boolean', 
    default: true,
    comment: 'Whether the applicant profile can be indexed and shown in search results'
  })
  allowProfileIndexing: boolean;

  @Column({ 
    name: 'allow_data_analytics',
    type: 'boolean', 
    default: true,
    comment: 'Whether the applicant allows their data to be used for analytics and insights'
  })
  allowDataAnalytics: boolean;

  @Column({ 
    name: 'allow_third_party_sharing',
    type: 'boolean', 
    default: false,
    comment: 'Whether the applicant allows their data to be shared with third-party partners'
  })
  allowThirdPartySharing: boolean;

  @Column({ 
    name: 'privacy_updated_at',
    type: 'timestamptz', 
    nullable: true,
    comment: 'Timestamp of the last privacy settings update'
  })
  privacyUpdatedAt: Date;

  /**
   * @property {Date} createdAt
   * @description A timestamp automatically set to the date and time of profile creation.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /**
   * @property {Date} updatedAt
   * @description A timestamp automatically updated whenever the profile record is modified.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

