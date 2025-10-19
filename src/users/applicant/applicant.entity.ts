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
  @PrimaryColumn({ type: 'uuid' })
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

  @Column({ length: 100, nullable: true })
  firstName: string;

  @Column({ length: 100, nullable: true })
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
    nullable: true,
    comment: 'URL to the applicant’s profile photo.',
  })
  photoUrl: string;

  @Column('text', {
    nullable: true,
    comment: 'URL to an external portfolio (e.g., Behance, GitHub).',
  })
  portfolioUrl: string;

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[];

  @Column({ type: 'enum', enum: ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'], nullable: true })
  experienceLevel: string;

  @Column({ type: 'enum', enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP'], nullable: true })
  preferredEmploymentType: string;

  /**
   * @property {Date} createdAt
   * @description A timestamp automatically set to the date and time of profile creation.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * @property {Date} updatedAt
   * @description A timestamp automatically updated whenever the profile record is modified.
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

