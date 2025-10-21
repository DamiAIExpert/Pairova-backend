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

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @Column('text', { nullable: true })
  website: string;

  @Column('text', { nullable: true, comment: 'The mission statement of the organization.' })
  mission: string;

  @Column('text', { nullable: true, comment: 'The core values of the organization.' })
  values: string;

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

