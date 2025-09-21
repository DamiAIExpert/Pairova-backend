// src/admin/applications/admin-applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  AdminApplicationDto, 
  AdminApplicationListDto, 
  UpdateApplicationStatusDto,
  ApplicationPipelineDto,
  ApplicationStatisticsDto
} from './dto/admin-application.dto';
import { ApplicationStatus } from '../../jobs/entities/application.entity';
import { Role } from '../../common/enums/role.enum';

/**
 * @class AdminApplicationsService
 * @description Provides business logic for admin application management operations.
 */
@Injectable()
export class AdminApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantRepository: Repository<ApplicantProfile>,
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
  ) {}

  /**
   * Get paginated list of all applications with optional filtering
   */
  async findAll(
    paginationDto: PaginationDto,
    filters: { 
      status?: string; 
      jobId?: string; 
      applicantId?: string; 
      ngoId?: string; 
      search?: string;
    } = {},
  ): Promise<AdminApplicationListDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { status, jobId, applicantId, ngoId, search } = filters;

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.applicant', 'applicant')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('applicant.applicantProfile', 'applicantProfile')
      .leftJoinAndSelect('postedBy.nonprofitProfile', 'nonprofitProfile')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('application.createdAt', 'DESC');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('application.status = :status', { status });
    }

    if (jobId) {
      queryBuilder.andWhere('application.jobId = :jobId', { jobId });
    }

    if (applicantId) {
      queryBuilder.andWhere('application.applicantId = :applicantId', { applicantId });
    }

    if (ngoId) {
      queryBuilder.andWhere('job.postedById = :ngoId', { ngoId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR applicantProfile.firstName ILIKE :search OR applicantProfile.lastName ILIKE :search OR nonprofitProfile.orgName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [applications, total] = await queryBuilder.getManyAndCount();

    // Transform applications to DTOs
    const applicationData = applications.map((app) => this.transformToDto(app));

    return {
      data: applicationData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed information about a specific application
   */
  async findOne(id: string): Promise<AdminApplicationDto> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: [
        'applicant',
        'applicant.applicantProfile',
        'job',
        'job.postedBy',
        'job.postedBy.nonprofitProfile',
      ],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.transformToDto(application);
  }

  /**
   * Update application status (move through pipeline)
   */
  async updateStatus(
    id: string,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ): Promise<AdminApplicationDto> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: [
        'applicant',
        'applicant.applicantProfile',
        'job',
        'job.postedBy',
        'job.postedBy.nonprofitProfile',
      ],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Update status
    application.status = updateApplicationStatusDto.status;
    
    // Add notes if provided
    if (updateApplicationStatusDto.notes) {
      // You might want to create a separate notes entity for application history
      // For now, we'll just update the application
    }

    const savedApplication = await this.applicationRepository.save(application);

    return this.transformToDto(savedApplication);
  }

  /**
   * Get application pipeline overview
   */
  async getPipeline(ngoId?: string): Promise<ApplicationPipelineDto> {
    let queryBuilder = this.applicationRepository.createQueryBuilder('application');

    if (ngoId) {
      queryBuilder = queryBuilder
        .leftJoin('application.job', 'job')
        .where('job.postedById = :ngoId', { ngoId });
    }

    const [applications, total] = await queryBuilder.getManyAndCount();

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    const hiredApplications = statusCounts[ApplicationStatus.HIRED] || 0;
    const hiringRate = total > 0 ? (hiredApplications / total) * 100 : 0;

    // Calculate average time to hire
    const hiredApps = applications.filter(app => app.status === ApplicationStatus.HIRED);
    const averageTimeToHire = hiredApps.length > 0
      ? hiredApps.reduce((sum, app) => {
          const timeToHire = (app.updatedAt.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return sum + timeToHire;
        }, 0) / hiredApps.length
      : undefined;

    return {
      pending: statusCounts[ApplicationStatus.PENDING] || 0,
      underReview: statusCounts[ApplicationStatus.UNDER_REVIEW] || 0,
      interview: statusCounts[ApplicationStatus.INTERVIEW] || 0,
      hired: hiredApplications,
      denied: statusCounts[ApplicationStatus.DENIED] || 0,
      withdrawn: statusCounts[ApplicationStatus.WITHDRAWN] || 0,
      total,
      hiringRate,
      averageTimeToHire,
    };
  }

  /**
   * Get application statistics
   */
  async getStatistics(ngoId?: string): Promise<ApplicationStatisticsDto> {
    let queryBuilder = this.applicationRepository.createQueryBuilder('application');

    if (ngoId) {
      queryBuilder = queryBuilder
        .leftJoin('application.job', 'job')
        .where('job.postedById = :ngoId', { ngoId });
    }

    const applications = await queryBuilder.getMany();
    const totalApplications = applications.length;

    // This month's applications
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const applicationsThisMonth = applications.filter(app =>
      app.createdAt >= startOfMonth
    ).length;

    // Applications by status
    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    // Average applications per job
    const uniqueJobs = new Set(applications.map(app => app.jobId)).size;
    const averageApplicationsPerJob = uniqueJobs > 0 ? totalApplications / uniqueJobs : 0;

    // Top performing jobs
    const jobApplicationCounts = applications.reduce((acc, app) => {
      const jobId = app.jobId;
      if (!acc[jobId]) {
        acc[jobId] = {
          jobId,
          applicationCount: 0,
          jobTitle: '', // Will be filled below
          ngoName: '', // Will be filled below
        };
      }
      acc[jobId].applicationCount++;
      return acc;
    }, {} as Record<string, any>);

    // Get job details for top jobs
    const topJobIds = Object.keys(jobApplicationCounts)
      .sort((a, b) => jobApplicationCounts[b].applicationCount - jobApplicationCounts[a].applicationCount)
      .slice(0, 5);

    const topJobs = await Promise.all(
      topJobIds.map(async (jobId) => {
        const job = await this.jobRepository.findOne({
          where: { id: jobId },
          relations: ['postedBy', 'postedBy.nonprofitProfile'],
        });

        return {
          jobId,
          jobTitle: job?.title || 'Unknown Job',
          ngoName: job?.postedBy.nonprofitProfile?.orgName || 'Unknown NGO',
          applicationCount: jobApplicationCounts[jobId].applicationCount,
        };
      })
    );

    // Hiring rate
    const hiredApplications = applicationsByStatus[ApplicationStatus.HIRED] || 0;
    const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;

    // Average time to hire
    const hiredApps = applications.filter(app => app.status === ApplicationStatus.HIRED);
    const averageTimeToHire = hiredApps.length > 0
      ? hiredApps.reduce((sum, app) => {
          const timeToHire = (app.updatedAt.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return sum + timeToHire;
        }, 0) / hiredApps.length
      : undefined;

    return {
      totalApplications,
      applicationsThisMonth,
      applicationsByStatus,
      averageApplicationsPerJob,
      topJobs,
      hiringRate,
      averageTimeToHire,
    };
  }

  /**
   * Transform application entity to DTO
   */
  private transformToDto(application: Application): AdminApplicationDto {
    const applicant = application.applicant;
    const applicantProfile = applicant.applicantProfile;
    const job = application.job;
    const postedBy = job.postedBy;
    const nonprofitProfile = postedBy.nonprofitProfile;

    const applicantName = applicantProfile
      ? `${applicantProfile.firstName || ''} ${applicantProfile.lastName || ''}`.trim()
      : 'Unknown Applicant';

    const applicantLocation = applicantProfile
      ? [applicantProfile.city, applicantProfile.state, applicantProfile.country]
          .filter(Boolean)
          .join(', ')
      : undefined;

    const ngoLocation = nonprofitProfile
      ? [nonprofitProfile.city, nonprofitProfile.state, nonprofitProfile.country]
          .filter(Boolean)
          .join(', ')
      : undefined;

    const daysSinceApplication = Math.floor(
      (Date.now() - application.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: application.id,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      coverLetter: application.coverLetter,
      resumeUrl: application.resumeUrl,
      applicantId: application.applicantId,
      applicantName,
      applicantEmail: applicant.email,
      applicantPhotoUrl: applicantProfile?.photoUrl,
      applicantPhone: applicant.phone,
      applicantLocation,
      jobId: application.jobId,
      jobTitle: job.title,
      jobDescription: job.description,
      employmentType: job.employmentType,
      placement: job.placement,
      ngoId: job.postedById,
      ngoName: nonprofitProfile?.orgName || 'Unknown Organization',
      ngoLogoUrl: nonprofitProfile?.logoUrl,
      ngoLocation,
      matchScore: undefined, // TODO: Add match score calculation
      daysSinceApplication,
    };
  }
}
