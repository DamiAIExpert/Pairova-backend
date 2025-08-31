// src/jobs/job-application/application.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { User } from '../../users/shared/user.entity';
import { Role } from '../../common/enums/role.enum';
import { JobsService } from '../jobs.service';

/**
 * @class ApplicationsService
 * @description Handles business logic for job applications.
 */
@Injectable()
export class ApplicationsService {
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
   * Finds all applications for a specific job (for nonprofits) or
   * submitted by a specific user (for applicants).
   * @param user - The user requesting the list.
   * @returns A list of applications.
   */
  async findAllForUser(user: User): Promise<Application[]> {
    if (user.role === Role.APPLICANT) {
      return this.applicationRepository.find({
        where: { applicantId: user.id },
        relations: ['job', 'job.organization'],
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
}
