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
import { Application } from './application.entity';

/**
 * @class Job
 * @description Represents a job posting created by a non-profit organization.
 */
@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
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

  @Column({ type: 'enum', enum: EmploymentType, nullable: true })
  employmentType!: EmploymentType;

  @Column({ type: 'int', nullable: true })
  experienceMinYrs!: number;

  @Column({ length: 100, nullable: true })
  locationCity!: string;

  @Column({ length: 100, nullable: true })
  locationState!: string;

  @Column({ length: 100, nullable: true })
  locationCountry!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  salaryMin!: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  salaryMax!: number;

  @Column({ length: 16, nullable: true })
  currency!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status!: JobStatus;

  @Column({ type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @OneToMany(() => Application, (application) => application.job)
  applications!: Application[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt!: Date;
}