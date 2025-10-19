import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';

// Re-export enums for external use
export { Role } from '../../common/enums/role.enum';
import { ApplicantProfile } from '../applicant/applicant.entity';
import { NonprofitOrg } from '../nonprofit/nonprofit.entity';

/**
 * @class User
 * @description The core user entity for the application. It holds authentication
 * information (email, password) and serves as the central point for linking to
 * role-specific profiles (Applicant or Non-Profit).
 */
@Entity('users')
export class User {
  /**
   * @property {string} id
   * @description The unique identifier for the user (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @property {Role} role
   * @description The role of the user, which determines their permissions and
   * which profile type is associated with them.
   */
  @Column({
    type: 'enum',
    enum: Role,
    comment: 'Defines if the user is an ADMIN, APPLICANT, or NONPROFIT.',
  })
  role: Role;

  /**
   * @property {string} email
   * @description The user's unique email address, used for login and communication.
   */
  @Column({ length: 255, unique: true })
  email: string;

  /**
   * @property {string} passwordHash
   * @description The hashed version of the user's password. The `select: false` option
   * prevents this field from being returned in queries by default, enhancing security.
   */
  @Column({ name: 'password_hash', length: 255, select: false, nullable: true })
  passwordHash: string;

  /**
   * @property {string} phone
   * @description The user's phone number.
   */
  @Column({ length: 64, nullable: true })
  phone: string;

  /**
   * @property {boolean} isVerified
   * @description A flag indicating whether the user has verified their email address.
   */
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  /**
   * @property {string} emailVerificationToken
   * @description Token used for email verification.
   */
  @Column({ name: 'email_verification_token', length: 255, nullable: true })
  emailVerificationToken: string;

  /**
   * @property {Date} lastLoginAt
   * @description A timestamp recording the last time the user successfully logged in.
   */
  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  /**
   * @property {Date} createdAt
   * @description A timestamp automatically set when the user is first created.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /**
   * @property {Date} updatedAt
   * @description A timestamp automatically updated whenever the user record is modified.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // --- Relationships ---

  /**
   * @property {ApplicantProfile} applicantProfile
   * @description The one-to-one relationship to the applicant's detailed profile.
   * This will only be populated for users with the 'APPLICANT' role.
   * `cascade: true` ensures that when a new User with an applicant profile is saved,
   * the profile is saved as well.
   */
  @OneToOne(() => ApplicantProfile, (profile) => profile.user, { cascade: true })
  applicantProfile: ApplicantProfile;

  /**
   * @property {NonprofitOrg} nonprofitOrg
   * @description The one-to-one relationship to the non-profit organization's profile.
   * This will only be populated for users with the 'NONPROFIT' role.
   */
  @OneToOne(() => NonprofitOrg, (org) => org.user, { cascade: true })
  nonprofitOrg: NonprofitOrg;

  /**
   * @property {NonprofitOrg} nonprofitProfile
   * @description Alias for nonprofitOrg for backward compatibility.
   */
  get nonprofitProfile(): NonprofitOrg | undefined {
    return this.nonprofitOrg;
  }
}

