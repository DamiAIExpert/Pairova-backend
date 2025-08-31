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
      relations: ['organization'],
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
      relations: ['organization', 'applications'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found.`);
    }
    return job;
  }
}
