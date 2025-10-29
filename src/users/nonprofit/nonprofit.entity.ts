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

/**
 * @class NonprofitOrg
 * @description Represents the profile for a user with the 'NONPROFIT' role.
 * This entity is linked one-to-one with the core User entity and holds all
 * organization-specific details like name, mission, and address.
 */
@Entity('nonprofit_orgs')
export class NonprofitOrg {
  /**
   * @property {string} userId
   * @description The primary key, also a foreign key to the `users` table.
   * This establishes a one-to-one link between a user and their organization profile.
   */
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  /**
   * @property {User} user
   * @description The associated User entity. `onDelete: 'CASCADE'` ensures that if a User
   * is deleted, their organization profile is also removed.
   */
  @OneToOne(() => User, (user) => user.nonprofitOrg, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'org_name', length: 255 })
  orgName: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @Column('text', { nullable: true })
  website: string;

  @Column('text', { nullable: true, comment: 'The mission statement of the organization.' })
  mission: string;

  @Column({ name: 'mission_statement', type: 'text', nullable: true, comment: 'The mission statement of the organization (alias for mission field)' })
  missionStatement: string;

  @Column('text', { nullable: true, comment: 'The core values of the organization.' })
  values: string;

  @Column({ name: 'phone', length: 20, nullable: true, comment: 'Organization contact phone number' })
  phone: string;

  @Column({ name: 'postal_code', length: 20, nullable: true, comment: 'Postal/ZIP code for the organization address' })
  postalCode: string;

  @Column({ name: 'size_label', length: 64, nullable: true, comment: 'e.g., "10-50 employees"' })
  sizeLabel: string;

  @Column({ name: 'org_type', length: 64, nullable: true, comment: 'e.g., "Private Company", "Charity"' })
  orgType: string;

  @Column({ length: 128, nullable: true })
  industry: string;

  @Column({ name: 'founded_on', type: 'date', nullable: true })
  foundedOn: Date;

  @Column({ name: 'tax_id', length: 128, nullable: true })
  taxId: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column('text', { nullable: true, comment: 'Organization description/bio (2-3 paragraphs about what they do, who they serve, impact made)' })
  bio: string;

  @Column({ length: 128, nullable: true, comment: 'Position/role of the contact person in the organization' })
  position: string;

  @Column({ name: 'registration_number', length: 128, nullable: true, comment: 'Official registration/incorporation number' })
  registrationNumber: string;

  @Column({ name: 'required_skills', type: 'jsonb', nullable: true, comment: 'Skills the organization is looking for (can be array or object with softSkills/hardSkills)' })
  requiredSkills: string[] | { softSkills?: string[]; hardSkills?: string[] };

  @Column({ name: 'social_media_links', type: 'jsonb', nullable: true, comment: 'Social media profile URLs (LinkedIn, Twitter, Facebook, Instagram, etc.)' })
  socialMediaLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  @Column({ name: 'certificate_url', type: 'text', nullable: true, comment: 'URL to organization certificate of registration/operation' })
  certificateUrl: string;

  /**
   * @property {Date} createdAt
   * @description A timestamp automatically set when the organization profile is created.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /**
   * @property {Date} updatedAt
   * @description A timestamp automatically updated whenever the organization profile is modified.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

