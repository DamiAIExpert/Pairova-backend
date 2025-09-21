import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/shared/user.entity';

/**
 * @class RecommendationScore
 * @description Stores AI-generated prediction scores for job-applicant matches.
 * This table caches predictions from the AI microservice to improve performance
 * and provide historical tracking of match scores.
 */
@Entity('recommendation_scores')
@Unique(['jobId', 'applicantId'])
@Index(['applicantId', 'createdAt'])
@Index(['jobId', 'createdAt'])
export class RecommendationScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  jobId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ type: 'uuid' })
  applicantId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'jsonb', nullable: true })
  scoreDetails: {
    skillMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
    industryMatch: number;
    educationMatch: number;
    cultureMatch: number;
    availabilityMatch: number;
    recommendationReason: string;
    skillGaps: string[];
    strengths: string[];
    improvements: string[];
  } | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modelVersion: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  predictionSource: string | null; // 'ai_microservice', 'cached', 'manual'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
