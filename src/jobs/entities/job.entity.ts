// src/jobs/entities/job.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { User } from '../../users/shared/user.entity';
import {
  EmploymentType,
  JobPlacement,
  JobStatus,
} from '../../common/enums/job.enum';

// Re-export enums for external use
export { JobStatus, EmploymentType, JobPlacement } from '../../common/enums/job.enum';
import { Application } from './application.entity';

/**
 * @class Job
 * @description Represents a job posting created by a non-profit organization.
 */
@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'org_user_id', type: 'uuid', nullable: true })
  orgUserId!: string;

  @ManyToOne(() => NonprofitOrg, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'org_user_id', referencedColumnName: 'userId' })
  organization!: NonprofitOrg;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'enum', enum: JobPlacement, nullable: true })
  placement!: JobPlacement;

  @Column({ name: 'employment_type', type: 'enum', enum: EmploymentType, nullable: true })
  employmentType!: EmploymentType;

  @Column({ name: 'experience_min_yrs', type: 'int', nullable: true })
  experienceMinYrs!: number;

  @Column({ name: 'experience_max_yrs', type: 'int', nullable: true })
  experienceMaxYrs!: number;

  @Column({ name: 'experience_level', type: 'varchar', length: 50, nullable: true })
  experienceLevel!: string;

  @Column({ name: 'required_skills', type: 'text', array: true, nullable: true })
  requiredSkills!: string[];

  @Column({ name: 'benefits', type: 'text', array: true, nullable: true })
  benefits!: string[];

  @Column({ name: 'deadline', type: 'timestamptz', nullable: true })
  deadline!: Date;

  @Column({ name: 'location_city', length: 100, nullable: true })
  locationCity!: string;

  @Column({ name: 'location_state', length: 100, nullable: true })
  locationState!: string;

  @Column({ name: 'location_country', length: 100, nullable: true })
  locationCountry!: string;

  @Column({ name: 'salary_min', type: 'numeric', precision: 14, scale: 2, nullable: true })
  salaryMin!: number;

  @Column({ name: 'salary_max', type: 'numeric', precision: 14, scale: 2, nullable: true })
  salaryMax!: number;

  @Column({ name: 'currency', length: 16, nullable: true })
  currency!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status!: JobStatus;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @Column({ name: 'posted_by_id', type: 'uuid', nullable: true })
  postedById!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'posted_by_id' })
  postedBy!: User;

  @OneToMany(() => Application, (application) => application.job)
  applications!: Application[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date;
}