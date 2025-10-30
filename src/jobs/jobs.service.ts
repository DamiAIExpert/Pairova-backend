// src/jobs/jobs.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { JobStatus } from '../common/enums/job.enum';

/**
 * @class JobsService
 * @description Handles business logic related to job postings.
 */
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  /**
   * Creates a new job posting.
   * Only users with the NONPROFIT role can create jobs.
   * @param createJobDto - The data for the new job.
   * @param currentUser - The user attempting to create the job.
   * @returns The newly created job.
   */
  async create(createJobDto: CreateJobDto, currentUser: User): Promise<Job> {
    if (currentUser.role !== Role.NONPROFIT) {
      throw new ForbiddenException(
        'Only non-profit organizations can post jobs.',
      );
    }

    const job = this.jobsRepository.create({
      ...createJobDto,
      orgUserId: currentUser.id,
      createdBy: currentUser.id,
      postedById: currentUser.id,
      status: createJobDto.status || JobStatus.DRAFT,
    });

    return this.jobsRepository.save(job);
  }

  /**
   * Finds all published jobs with pagination.
   * @returns A list of jobs.
   */
  async findAllPublished(): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { status: JobStatus.PUBLISHED },
      // relations: ['organization'], // Temporarily disabled to test
    });
  }

  /**
   * Finds a single job by its ID.
   * @param id - The UUID of the job to find.
   * @returns The found job.
   * @throws {NotFoundException} If no job is found with the given ID.
   */
  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['applications'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }
    return job;
  }

  /**
   * Publishes a job (changes status from DRAFT to PUBLISHED).
   * @param id - The UUID of the job to publish.
   * @param currentUser - The user attempting to publish the job.
   * @returns The updated job.
   */
  async publish(id: string, currentUser: User): Promise<Job> {
    const job = await this.findOne(id);
    
    if (currentUser.role !== Role.NONPROFIT || job.orgUserId !== currentUser.id) {
      throw new ForbiddenException('Only the job owner can publish this job.');
    }

    if (job.status !== JobStatus.DRAFT) {
      throw new ForbiddenException('Only draft jobs can be published.');
    }

    job.status = JobStatus.PUBLISHED;
    return this.jobsRepository.save(job);
  }

  /**
   * Closes a job (changes status to CLOSED).
   * @param id - The UUID of the job to close.
   * @param currentUser - The user attempting to close the job.
   * @returns The updated job.
   */
  async close(id: string, currentUser: User): Promise<Job> {
    const job = await this.findOne(id);
    
    if (currentUser.role !== Role.NONPROFIT || job.orgUserId !== currentUser.id) {
      throw new ForbiddenException('Only the job owner can close this job.');
    }

    if (job.status === JobStatus.CLOSED) {
      throw new ForbiddenException('Job is already closed.');
    }

    job.status = JobStatus.CLOSED;
    return this.jobsRepository.save(job);
  }

  /**
   * Gets featured jobs (jobs marked as featured or with high priority).
   * @param limit - Maximum number of featured jobs to return.
   * @returns A list of featured jobs.
   */
  async getFeaturedJobs(limit: number = 10): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { status: JobStatus.PUBLISHED },
      // relations: ['organization'], // Temporarily disabled
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Gets all jobs posted by a specific organization with pagination and filtering.
   * @param user - The nonprofit user whose jobs to retrieve.
   * @param status - Optional status filter.
   * @param page - Page number (starting from 1).
   * @param limit - Number of items per page.
   * @returns Paginated list of jobs with total count.
   */
  async getJobsByOrganization(
    user: User,
    status?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ jobs: Job[]; total: number; page: number; limit: number }> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can access this resource.');
    }

    const query = this.jobsRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .where('job.orgUserId = :userId', { userId: user.id });

    // Apply status filter if provided
    if (status) {
      query.andWhere('job.status = :status', { status });
    }

    // Order by most recent first
    query.orderBy('job.createdAt', 'DESC');

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Execute query
    const jobs = await query.getMany();

    return {
      jobs,
      total,
      page,
      limit,
    };
  }

  /**
   * Gets a single job by ID, ensuring it belongs to the specified organization.
   * @param id - The job ID.
   * @param user - The nonprofit user.
   * @returns The job if found and owned by the user.
   * @throws {NotFoundException} If job not found.
   * @throws {ForbiddenException} If job doesn't belong to the user.
   */
  async getJobByOrganization(id: string, user: User): Promise<Job> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can access this resource.');
    }

    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['organization', 'applications'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }

    if (job.orgUserId !== user.id) {
      throw new ForbiddenException('This job belongs to another organization.');
    }

    return job;
  }

  /**
   * Deletes a job posted by the organization.
   * @param id - The job ID.
   * @param user - The nonprofit user.
   * @returns Success message.
   * @throws {NotFoundException} If job not found.
   * @throws {ForbiddenException} If job doesn't belong to the user.
   */
  async deleteJobByOrganization(id: string, user: User): Promise<{ message: string }> {
    if (user.role !== Role.NONPROFIT) {
      throw new ForbiddenException('Only nonprofit organizations can delete jobs.');
    }

    const job = await this.jobsRepository.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }

    if (job.orgUserId !== user.id) {
      throw new ForbiddenException('This job belongs to another organization.');
    }

    await this.jobsRepository.remove(job);

    return { message: 'Job deleted successfully' };
  }
}
