// src/admin/dto/dashboard.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../jobs/entities/application.entity';
import { JobStatus } from '../../jobs/entities/job.entity';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Total number of applicants' })
  totalApplicants: number;

  @ApiProperty({ description: 'Total number of nonprofits' })
  totalNonprofits: number;

  @ApiProperty({ description: 'Total number of jobs' })
  totalJobs: number;

  @ApiProperty({ description: 'Total number of applications' })
  totalApplications: number;

  @ApiProperty({ description: 'Active jobs count' })
  activeJobs: number;

  @ApiProperty({ description: 'Verified users count' })
  verifiedUsers: number;

  @ApiProperty({ description: 'Applications this month' })
  applicationsThisMonth: number;

  @ApiProperty({ description: 'New users this month' })
  newUsersThisMonth: number;

  @ApiProperty({ description: 'Hiring rate percentage' })
  hiringRate: number;

  @ApiProperty({ description: 'Average applications per job' })
  averageApplicationsPerJob: number;
}

export class PerformanceDataPoint {
  @ApiProperty({ description: 'Date in ISO format' })
  date: string;

  @ApiProperty({ description: 'Value for this date' })
  value: number;
}

export class PerformanceMetricsDto {
  @ApiProperty({ description: 'User registrations over time', type: [PerformanceDataPoint] })
  userRegistrations: PerformanceDataPoint[];

  @ApiProperty({ description: 'Job postings over time', type: [PerformanceDataPoint] })
  jobPostings: PerformanceDataPoint[];

  @ApiProperty({ description: 'Applications over time', type: [PerformanceDataPoint] })
  applications: PerformanceDataPoint[];

  @ApiProperty({ description: 'Successful matches over time', type: [PerformanceDataPoint] })
  successfulMatches: PerformanceDataPoint[];

  @ApiProperty({ description: 'Time period covered' })
  period: string;
}

export class ActivityItem {
  @ApiProperty({ description: 'Activity ID' })
  id: string;

  @ApiProperty({ description: 'Activity type' })
  type: 'USER_REGISTERED' | 'JOB_POSTED' | 'APPLICATION_SUBMITTED' | 'USER_VERIFIED' | 'JOB_PUBLISHED';

  @ApiProperty({ description: 'Activity description' })
  description: string;

  @ApiProperty({ description: 'User who performed the action', required: false })
  user?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ description: 'Related entity ID', required: false })
  entityId?: string;

  @ApiProperty({ description: 'Activity timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: Record<string, any>;
}

export class ActivityFeedDto {
  @ApiProperty({ description: 'List of recent activities', type: [ActivityItem] })
  activities: ActivityItem[];

  @ApiProperty({ description: 'Total number of activities' })
  total: number;
}

export class RecommendationDto {
  @ApiProperty({ description: 'Recommendation ID' })
  id: string;

  @ApiProperty({ description: 'Recommendation type' })
  type: 'HIGH_MATCH_SCORE' | 'PENDING_REVIEW' | 'ACTIVE_APPLICANTS' | 'JOB_RECOMMENDATION';

  @ApiProperty({ description: 'Recommendation title' })
  title: string;

  @ApiProperty({ description: 'Recommendation description' })
  description: string;

  @ApiProperty({ description: 'Priority level (1-5)' })
  priority: number;

  @ApiProperty({ description: 'Related entity IDs', required: false })
  entityIds?: string[];

  @ApiProperty({ description: 'Action URL', required: false })
  actionUrl?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;
}

export class RecommendationsDto {
  @ApiProperty({ description: 'List of recommendations', type: [RecommendationDto] })
  recommendations: RecommendationDto[];

  @ApiProperty({ description: 'High priority recommendations count' })
  highPriorityCount: number;
}
