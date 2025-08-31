// src/profiles/experience/entities/experience.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/shared/user.entity';
import { EmploymentType } from '../../../common/enums/employment-type.enum';

/**
 * @class Experience
 * @description Represents an applicant's work experience.
 */
@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  company: string;

  @Column({ length: 255 })
  roleTitle: string;

  @Column({ type: 'enum', enum: EmploymentType, nullable: true })
  employmentType: EmploymentType;

  @Column({ length: 100, nullable: true })
  locationCity: string;

  @Column({ length: 100, nullable: true })
  locationState: string;

  @Column({ length: 100, nullable: true })
  locationCountry: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
