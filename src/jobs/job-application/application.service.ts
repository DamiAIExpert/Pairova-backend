// src/jobs/job-application/application.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { CreateComprehensiveApplicationDto } from '../dto/create-comprehensive-application.dto';
import { User } from '../../users/shared/user.entity';
import { Role } from '../../common/enums/role.enum';
import { JobsService } from '../jobs.service';
import { ApplicationStatus } from '../../common/enums/job.enum';

/**
 * @class ApplicationsService
 * @description Handles business logic for job applications.
 */
@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly jobsService: JobsService,
  ) {}

  /**
   * Creates a new job application.
   * @param createApplicationDto - The application data.
   * @param currentUser - The user submitting the application.
   * @returns The newly created application.
   */
  async apply(
    createApplicationDto: CreateApplicationDto,
    currentUser: User,
  ): Promise<Application> {
    if (currentUser.role !== Role.APPLICANT) {
      throw new ForbiddenException('Only applicants can apply for jobs.');
    }

    // Ensure the job exists
    await this.jobsService.findOne(createApplicationDto.jobId);

    // Check if user has already applied
    const existingApplication = await this.applicationRepository.findOne({
        where: {
            jobId: createApplicationDto.jobId,
            applicantId: currentUser.id
        }
    });

    if (existingApplication) {
        throw new ConflictException('You have already applied for this job.');
    }

    const application = this.applicationRepository.create({
      ...createApplicationDto,
      applicantId: currentUser.id,
    });

    return this.applicationRepository.save(application);
  }

  /**
   * Creates a new comprehensive job application with detailed data.
   * @param createComprehensiveDto - The comprehensive application data.
   * @param currentUser - The user submitting the application.
   * @returns The newly created application.
   */
  async applyComprehensive(
    createComprehensiveDto: CreateComprehensiveApplicationDto,
    currentUser: User,
  ): Promise<Application> {
    if (currentUser.role !== Role.APPLICANT) {
      throw new ForbiddenException('Only applicants can apply for jobs.');
    }

    // Validate job exists (only if it's a valid UUID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      createComprehensiveDto.jobId,
    );
    
    if (isUUID) {
      // Real job - validate it exists
      await this.jobsService.findOne(createComprehensiveDto.jobId);
    } else {
      // Demo job ID - log for debugging
      this.logger.log(`Demo job application for jobId: ${createComprehensiveDto.jobId}`);
    }

    // Check if user has already applied
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        jobId: createComprehensiveDto.jobId,
        applicantId: currentUser.id,
      },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job.');
    }

    // Extract basic fields and comprehensive data
    const { jobId, coverLetter, resumeUploadId, ...comprehensiveData } = createComprehensiveDto;

    // Create application with comprehensive data stored in JSON field
    const application = this.applicationRepository.create({
      jobId,
      coverLetter,
      resumeUploadId,
      applicantId: currentUser.id,
      applicationData: comprehensiveData, // Store all additional data as JSON
    });

    return this.applicationRepository.save(application);
  }

  /**
   * Finds all applications for a specific job (for nonprofits) or
   * submitted by a specific user (for applicants).
   * @param user - The user requesting the list.
   * @returns A list of applications.
   */
  async findAllForUser(user: User): Promise<Application[]> {
    if (user.role === Role.APPLICANT) {
      return this.applicationRepository.find({
        where: { applicantId: user.id },
        relations: [
          'job',
          'job.organization',
          'applicant',
          'applicant.applicantProfile'
        ],
        order: { appliedAt: 'DESC' },
      });
    }
    // For NONPROFIT, we might want to list all applications for their jobs.
    // This requires a more complex query and is left for a dedicated endpoint.
    return [];
  }

  /**
   * Finds a single application by its ID.
   * @param id - The UUID of the application.
   * @param user - The user requesting the application.
   * @returns The found application.
   */
  async findOne(id: string, user: User): Promise<Application> {
    const application = await this.applicationRepository.findOne({
        where: { id },
        relations: ['job', 'applicant', 'applicant.applicantProfile']
    });

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found.`);
    }

    // Security check: ensure the user is authorized to view this application
    if (user.role === Role.APPLICANT && application.applicantId !== user.id) {
        throw new ForbiddenException('You are not authorized to view this application.');
    }
    if (user.role === Role.NONPROFIT && application.job.orgUserId !== user.id) {
        throw new ForbiddenException('You are not authorized to view this application.');
    }

    return application;
  }

  /**
   * Updates the status of an application.
   * @param id - The UUID of the application.
   * @param status - The new status.
   * @param notes - Optional notes about the status change.
   * @param user - The user updating the status.
   * @returns The updated application.
   */
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    notes: string | undefined,
    user: User,
  ): Promise<Application> {
    const application = await this.findOne(id, user);

    // Only nonprofits can update application status
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can update application status.');
    }

    // Check if the user owns the job
    if (application.job.orgUserId !== user.id) {
      throw new ForbiddenException('You are not authorized to update this application.');
    }

    application.status = status;
    if (notes) {
      application.notes = notes;
    }

    return this.applicationRepository.save(application);
  }

  /**
   * Removes an application by ID.
   * @param id - The UUID of the application to remove.
   */
  async remove(id: string): Promise<void> {
    const result = await this.applicationRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Application with ID "${id}" not found.`);
    }
  }

  /**
   * Get all applications for jobs posted by a specific nonprofit
   * @param user - The nonprofit user
   * @param filters - Optional filters (status, jobId)
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated applications
   */
  async getApplicationsByOrganization(
    user: User,
    filters: { status?: string; jobId?: string } = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<{ applications: Application[]; total: number; page: number; limit: number }> {
    this.logger.log(`Getting applications for organization: ${user.email} (${user.id}), role: ${user.role}`);
    
    if (user.role !== Role.NONPROFIT) {
      this.logger.warn(`User ${user.email} attempted to access applications but role is ${user.role}, not NONPROFIT`);
      throw new ForbiddenException('Only nonprofit organizations can access this resource.');
    }

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.applicant', 'applicant')
      .leftJoinAndSelect('applicant.applicantProfile', 'applicantProfile')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('application.resume', 'resume')
      .where('job.orgUserId = :userId', { userId: user.id })
      .orderBy('application.appliedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('application.status = :status', { status: filters.status });
    }

    if (filters.jobId) {
      queryBuilder.andWhere('application.jobId = :jobId', { jobId: filters.jobId });
    }

    // Log the SQL query for debugging
    const sql = queryBuilder.getSql();
    this.logger.debug(`Query SQL: ${sql}`);
    this.logger.debug(`Query parameters: userId=${user.id}, page=${page}, limit=${limit}`);

    const [applications, total] = await queryBuilder.getManyAndCount();

    this.logger.log(`Found ${applications.length} applications (total: ${total}) for user ${user.email}`);

    return {
      applications,
      total,
      page,
      limit,
    };
  }

  /**
   * Get application statistics for a nonprofit
   * @param user - The nonprofit user
   * @returns Application statistics
   */
  async getApplicationStatistics(user: User): Promise<{
    totalApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
    shortlistedApplications: number;
    interviewedApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    applicationsThisMonth: number;
  }> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can access this resource.');
    }

    const baseQuery = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .where('job.orgUserId = :userId', { userId: user.id });

    const totalApplications = await baseQuery.getCount();

    const pendingApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.PENDING })
      .getCount();

    const reviewedApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.REVIEWED })
      .getCount();

    const shortlistedApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.SHORTLISTED })
      .getCount();

    const interviewedApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.INTERVIEWED })
      .getCount();

    const acceptedApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.ACCEPTED })
      .getCount();

    const rejectedApplications = await baseQuery
      .clone()
      .andWhere('application.status = :status', { status: ApplicationStatus.REJECTED })
      .getCount();

    // Applications this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const applicationsThisMonth = await baseQuery
      .clone()
      .andWhere('application.appliedAt >= :startOfMonth', { startOfMonth })
      .getCount();

    return {
      totalApplications,
      pendingApplications,
      reviewedApplications,
      shortlistedApplications,
      interviewedApplications,
      acceptedApplications,
      rejectedApplications,
      applicationsThisMonth,
    };
  }

  /**
   * Get a specific application for a nonprofit
   * @param applicationId - The application ID
   * @param user - The nonprofit user
   * @returns The application
   */
  async getApplicationByOrganization(applicationId: string, user: User): Promise<Application> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can access this resource.');
    }

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['applicant', 'applicant.applicantProfile', 'job', 'resume'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID "${applicationId}" not found.`);
    }

    // Verify that the application is for a job posted by this nonprofit
    if (application.job.orgUserId !== user.id) {
      throw new ForbiddenException('You are not authorized to view this application.');
    }

    return application;
  }

  /**
   * Update application status for a nonprofit
   * @param applicationId - The application ID
   * @param user - The nonprofit user
   * @param updateData - The update data
   * @returns Success message
   */
  async updateApplicationStatusByOrganization(
    applicationId: string,
    user: User,
    updateData: {
      status: string;
      notes?: string;
      interviewDate?: Date;
      rejectionReason?: string;
    },
  ): Promise<{ message: string }> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can update applications.');
    }

    const application = await this.getApplicationByOrganization(applicationId, user);

    // Update the application
    application.status = updateData.status as ApplicationStatus;
    if (updateData.notes) {
      application.notes = updateData.notes;
    }

    // Store additional data in applicationData JSON field
    if (updateData.interviewDate || updateData.rejectionReason) {
      application.applicationData = {
        ...application.applicationData,
        interviewDate: updateData.interviewDate,
        rejectionReason: updateData.rejectionReason,
      };
    }

    await this.applicationRepository.save(application);

    return { message: 'Application status updated successfully' };
  }

  /**
   * Bulk update application statuses for a nonprofit
   * @param user - The nonprofit user
   * @param applicationIds - Array of application IDs
   * @param status - The new status
   * @param notes - Optional notes
   * @returns Success message with count
   */
  async bulkUpdateApplicationStatusByOrganization(
    user: User,
    applicationIds: string[],
    status: string,
    notes?: string,
  ): Promise<{ message: string; updatedCount: number }> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can update applications.');
    }

    // Verify all applications belong to this nonprofit
    const applications = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoin('application.job', 'job')
      .where('application.id IN (:...ids)', { ids: applicationIds })
      .andWhere('job.orgUserId = :userId', { userId: user.id })
      .getMany();

    if (applications.length !== applicationIds.length) {
      throw new ForbiddenException('Some applications do not belong to your organization.');
    }

    // Update all applications
    for (const application of applications) {
      application.status = status as ApplicationStatus;
      if (notes) {
        application.notes = notes;
      }
    }

    await this.applicationRepository.save(applications);

    return {
      message: 'Application statuses updated successfully',
      updatedCount: applications.length,
    };
  }
}
