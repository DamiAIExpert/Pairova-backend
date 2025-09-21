// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { Role } from '../common/enums/role.enum';
import { JobStatus } from '../jobs/entities/job.entity';
import { ApplicationStatus } from '../jobs/entities/application.entity';
import { 
  DashboardStatsDto, 
  PerformanceMetricsDto, 
  ActivityFeedDto, 
  PerformanceDataPoint,
  ActivityItem,
  RecommendationsDto,
  RecommendationDto
} from './dto/dashboard.dto';

/**
 * @class AdminService
 * @description Provides business logic for general administrative tasks, like fetching dashboard statistics.
 */
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  /**
   * Gathers key metrics for the admin dashboard.
   * @returns {Promise<DashboardStatsDto>} An object containing various platform statistics.
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const totalUsers = await this.userRepository.count();
    const totalApplicants = await this.userRepository.count({ where: { role: Role.APPLICANT } });
    const totalNonprofits = await this.userRepository.count({ where: { role: Role.NONPROFIT } });
    const totalJobs = await this.jobRepository.count();
    const totalApplications = await this.applicationRepository.count();
    const activeJobs = await this.jobRepository.count({ where: { status: JobStatus.PUBLISHED } });
    const verifiedUsers = await this.userRepository.count({ where: { isVerified: true } });

    // This month's data
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const applicationsThisMonth = await this.applicationRepository.count({
      where: {
        createdAt: Between(startOfMonth, new Date()),
      },
    });

    const newUsersThisMonth = await this.userRepository.count({
      where: {
        createdAt: Between(startOfMonth, new Date()),
      },
    });

    // Calculate hiring rate
    const hiredApplications = await this.applicationRepository.count({
      where: { status: ApplicationStatus.HIRED },
    });
    const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;

    // Calculate average applications per job
    const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;

    return {
      totalUsers,
      totalApplicants,
      totalNonprofits,
      totalJobs,
      totalApplications,
      activeJobs,
      verifiedUsers,
      applicationsThisMonth,
      newUsersThisMonth,
      hiringRate,
      averageApplicationsPerJob,
    };
  }

  /**
   * Get performance metrics over time for charts
   */
  async getPerformanceMetrics(period: string): Promise<PerformanceMetricsDto> {
    const days = this.parsePeriod(period);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Generate date points
    const datePoints = this.generateDatePoints(startDate, endDate);

    // User registrations over time
    const userRegistrations = await Promise.all(
      datePoints.map(async (date) => ({
        date: date.toISOString().split('T')[0],
        value: await this.userRepository.count({
          where: {
            createdAt: Between(
              new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            ),
          },
        }),
      })),
    );

    // Job postings over time
    const jobPostings = await Promise.all(
      datePoints.map(async (date) => ({
        date: date.toISOString().split('T')[0],
        value: await this.jobRepository.count({
          where: {
            createdAt: Between(
              new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            ),
          },
        }),
      })),
    );

    // Applications over time
    const applications = await Promise.all(
      datePoints.map(async (date) => ({
        date: date.toISOString().split('T')[0],
        value: await this.applicationRepository.count({
          where: {
            createdAt: Between(
              new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            ),
          },
        }),
      })),
    );

    // Successful matches (hired applications) over time
    const successfulMatches = await Promise.all(
      datePoints.map(async (date) => ({
        date: date.toISOString().split('T')[0],
        value: await this.applicationRepository.count({
          where: {
            status: ApplicationStatus.HIRED,
            updatedAt: Between(
              new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            ),
          },
        }),
      })),
    );

    return {
      userRegistrations,
      jobPostings,
      applications,
      successfulMatches,
      period,
    };
  }

  /**
   * Get recent activity feed
   */
  async getActivityFeed(limit: number): Promise<ActivityFeedDto> {
    // Get recent user registrations
    const recentUsers = await this.userRepository.find({
      take: Math.ceil(limit * 0.4),
      order: { createdAt: 'DESC' },
      relations: ['applicantProfile', 'nonprofitProfile'],
    });

    // Get recent job postings
    const recentJobs = await this.jobRepository.find({
      take: Math.ceil(limit * 0.3),
      order: { createdAt: 'DESC' },
      relations: ['postedBy', 'postedBy.nonprofitProfile'],
    });

    // Get recent applications
    const recentApplications = await this.applicationRepository.find({
      take: Math.ceil(limit * 0.3),
      order: { createdAt: 'DESC' },
      relations: ['applicant', 'applicant.applicantProfile', 'job'],
    });

    const activities: ActivityItem[] = [];

    // Transform user registrations to activities
    recentUsers.forEach((user) => {
      const name = user.role === Role.APPLICANT && user.applicantProfile
        ? `${user.applicantProfile.firstName} ${user.applicantProfile.lastName}`.trim()
        : user.role === Role.NONPROFIT && user.nonprofitProfile
        ? user.nonprofitProfile.orgName
        : 'Unknown User';

      activities.push({
        id: `user-${user.id}`,
        type: 'USER_REGISTERED',
        description: `${name} registered as ${user.role.toLowerCase()}`,
        user: {
          id: user.id,
          name,
          email: user.email,
        },
        entityId: user.id,
        timestamp: user.createdAt,
        metadata: { role: user.role },
      });
    });

    // Transform job postings to activities
    recentJobs.forEach((job) => {
      const orgName = job.postedBy.nonprofitProfile?.orgName || 'Unknown Organization';
      activities.push({
        id: `job-${job.id}`,
        type: 'JOB_POSTED',
        description: `${orgName} posted a new job: ${job.title}`,
        entityId: job.id,
        timestamp: job.createdAt,
        metadata: { jobTitle: job.title, orgName },
      });
    });

    // Transform applications to activities
    recentApplications.forEach((app) => {
      const applicantName = app.applicant.applicantProfile
        ? `${app.applicant.applicantProfile.firstName} ${app.applicant.applicantProfile.lastName}`.trim()
        : 'Unknown Applicant';

      activities.push({
        id: `app-${app.id}`,
        type: 'APPLICATION_SUBMITTED',
        description: `${applicantName} applied for ${app.job.title}`,
        entityId: app.id,
        timestamp: app.createdAt,
        metadata: { 
          jobTitle: app.job.title,
          applicantName,
          status: app.status,
        },
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const limitedActivities = activities.slice(0, limit);

    return {
      activities: limitedActivities,
      total: activities.length,
    };
  }

  /**
   * Get AI matching insights and recommendations
   */
  async getRecommendations(): Promise<RecommendationsDto> {
    const recommendations: RecommendationDto[] = [];

    // High match score recommendations
    const pendingApplications = await this.applicationRepository.count({
      where: { status: ApplicationStatus.PENDING },
    });

    if (pendingApplications > 0) {
      recommendations.push({
        id: 'pending-applications',
        type: 'PENDING_REVIEW',
        title: 'Applications Pending Review',
        description: `${pendingApplications} applications are waiting for review`,
        priority: 3,
        actionUrl: '/admin/applications?status=PENDING',
        createdAt: new Date(),
      });
    }

    // Active applicants without recent applications
    const activeApplicants = await this.userRepository.count({
      where: { role: Role.APPLICANT, isVerified: true },
    });

    const recentApplications = await this.applicationRepository.count({
      where: {
        createdAt: Between(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          new Date(),
        ),
      },
    });

    if (activeApplicants > recentApplications * 2) {
      recommendations.push({
        id: 'engagement-opportunity',
        type: 'ACTIVE_APPLICANTS',
        title: 'Low Application Activity',
        description: `${activeApplicants} active applicants with low recent application activity`,
        priority: 2,
        actionUrl: '/admin/job-seekers',
        createdAt: new Date(),
      });
    }

    // Jobs with high application counts
    const popularJobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.applications', 'application')
      .select('job.id')
      .addSelect('job.title')
      .addSelect('COUNT(application.id)', 'applicationCount')
      .groupBy('job.id')
      .having('COUNT(application.id) > 10')
      .orderBy('COUNT(application.id)', 'DESC')
      .limit(5)
      .getRawMany();

    if (popularJobs.length > 0) {
      recommendations.push({
        id: 'popular-jobs',
        type: 'JOB_RECOMMENDATION',
        title: 'High-Demand Jobs',
        description: `${popularJobs.length} jobs have over 10 applications each`,
        priority: 4,
        entityIds: popularJobs.map(job => job.job_id),
        actionUrl: '/admin/ngos',
        createdAt: new Date(),
      });
    }

    const highPriorityCount = recommendations.filter(r => r.priority >= 4).length;

    return {
      recommendations,
      highPriorityCount,
    };
  }

  /**
   * Parse period string to number of days
   */
  private parsePeriod(period: string): number {
    const match = period.match(/^(\d+)([dwmy])$/);
    if (!match) return 30;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd': return value;
      case 'w': return value * 7;
      case 'm': return value * 30;
      case 'y': return value * 365;
      default: return 30;
    }
  }

  /**
   * Generate array of dates between start and end
   */
  private generateDatePoints(startDate: Date, endDate: Date): Date[] {
    const points: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      points.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return points;
  }
}
