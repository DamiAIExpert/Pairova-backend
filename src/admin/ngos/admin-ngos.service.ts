// src/admin/ngos/admin-ngos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from '../../jobs/entities/application.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  AdminNgoDto, 
  AdminNgoListDto, 
  NgoJobDto, 
  NgoJobsListDto, 
  JobApplicantDto, 
  JobApplicantsListDto,
  NgoStatisticsDto 
} from './dto/admin-ngo.dto';
import { UpdateNgoDto } from './dto/update-ngo.dto';
import { Role } from '../../common/enums/role.enum';
import { JobStatus } from '../../jobs/entities/job.entity';
import { ApplicationStatus } from '../../jobs/entities/application.entity';

/**
 * @class AdminNgosService
 * @description Provides business logic for admin NGO management operations.
 */
@Injectable()
export class AdminNgosService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  /**
   * Get paginated list of all NGOs with optional filtering
   */
  async findAll(
    paginationDto: PaginationDto,
    filters: { search?: string } = {},
  ): Promise<AdminNgoListDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { search } = filters;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.nonprofitProfile', 'nonprofit')
      .where('user.role = :role', { role: Role.NONPROFIT })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR nonprofit.orgName ILIKE :search OR nonprofit.industry ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    // Transform users to include profile data and job counts
    const ngoData = await Promise.all(
      users.map(async (user) => this.transformUserToNgoDto(user)),
    );

    return {
      data: ngoData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed information about a specific NGO
   */
  async findOne(id: string): Promise<AdminNgoDto> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.NONPROFIT },
      relations: ['nonprofitProfile'],
    });

    if (!user) {
      throw new NotFoundException('NGO not found');
    }

    return this.transformUserToNgoDto(user);
  }

  /**
   * Update NGO profile information
   */
  async update(id: string, updateNgoDto: UpdateNgoDto): Promise<AdminNgoDto> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.NONPROFIT },
      relations: ['nonprofitProfile'],
    });

    if (!user) {
      throw new NotFoundException('NGO not found');
    }

    // Update user fields
    if (updateNgoDto.isVerified !== undefined) {
      user.isVerified = updateNgoDto.isVerified;
    }
    if (updateNgoDto.phone) {
      user.phone = updateNgoDto.phone;
    }

    await this.userRepository.save(user);

    // Update nonprofit profile fields
    if (user.nonprofitProfile) {
      const profile = user.nonprofitProfile;
      Object.assign(profile, {
        orgName: updateNgoDto.orgName,
        website: updateNgoDto.website,
        mission: updateNgoDto.mission,
        values: updateNgoDto.values,
        sizeLabel: updateNgoDto.sizeLabel,
        orgType: updateNgoDto.orgType,
        industry: updateNgoDto.industry,
        foundedOn: updateNgoDto.foundedOn ? new Date(updateNgoDto.foundedOn) : undefined,
        taxId: updateNgoDto.taxId,
        country: updateNgoDto.country,
        state: updateNgoDto.state,
        city: updateNgoDto.city,
        addressLine1: updateNgoDto.addressLine1,
        addressLine2: updateNgoDto.addressLine2,
      });
      await this.nonprofitRepository.save(profile);
    }

    return this.transformUserToNgoDto(user);
  }

  /**
   * Delete or suspend an NGO account
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.NONPROFIT },
    });

    if (!user) {
      throw new NotFoundException('NGO not found');
    }

    // Soft delete by marking as unverified
    user.isVerified = false;
    await this.userRepository.save(user);

    return { message: 'NGO account suspended successfully' };
  }

  /**
   * Get all jobs posted by a specific NGO
   */
  async getJobs(id: string, paginationDto: PaginationDto): Promise<NgoJobsListDto> {
    const { page = 1, limit = 10 } = paginationDto;

    const [jobs, total] = await this.jobRepository.findAndCount({
      where: { postedById: id },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const jobData: NgoJobDto[] = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await this.applicationRepository.count({
          where: { jobId: job.id },
        });

        return {
          id: job.id,
          title: job.title,
          description: job.description,
          employmentType: job.employmentType,
          placement: job.placement,
          status: job.status,
          postedAt: job.createdAt,
          applicationCount,
        };
      }),
    );

    return {
      data: jobData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get all applicants for a specific job posted by an NGO
   */
  async getJobApplicants(
    ngoId: string,
    jobId: string,
    paginationDto: PaginationDto,
  ): Promise<JobApplicantsListDto> {
    const { page = 1, limit = 10 } = paginationDto;

    // Verify the job belongs to the NGO
    const job = await this.jobRepository.findOne({
      where: { id: jobId, postedById: ngoId },
    });

    if (!job) {
      throw new NotFoundException('Job not found for this NGO');
    }

    const [applications, total] = await this.applicationRepository.findAndCount({
      where: { jobId },
      relations: ['applicant', 'applicant.applicantProfile'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const applicantData: JobApplicantDto[] = applications.map((app) => ({
      applicationId: app.id,
      applicantId: app.applicantId,
      applicantName: app.applicant.applicantProfile
        ? `${app.applicant.applicantProfile.firstName || ''} ${app.applicant.applicantProfile.lastName || ''}`.trim()
        : 'Unknown',
      applicantEmail: app.applicant.email,
      status: app.status,
      appliedAt: app.createdAt,
      matchScore: undefined, // TODO: Add match score calculation
      photoUrl: app.applicant.applicantProfile?.photoUrl,
    }));

    return {
      data: applicantData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get statistics for an NGO
   */
  async getStatistics(id: string): Promise<NgoStatisticsDto> {
    // Verify NGO exists
    const ngo = await this.userRepository.findOne({
      where: { id, role: Role.NONPROFIT },
    });

    if (!ngo) {
      throw new NotFoundException('NGO not found');
    }

    // Get job statistics
    const totalJobs = await this.jobRepository.count({
      where: { postedById: id },
    });

    const activeJobs = await this.jobRepository.count({
      where: { postedById: id, status: JobStatus.PUBLISHED },
    });

    // Get application statistics
    const applications = await this.applicationRepository
      .createQueryBuilder('app')
      .leftJoin('app.job', 'job')
      .where('job.postedById = :ngoId', { ngoId: id })
      .getMany();

    const totalApplications = applications.length;
    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    // Get jobs by status
    const jobs = await this.jobRepository.find({
      where: { postedById: id },
    });

    const jobsByStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<JobStatus, number>);

    const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
    const hiredApplications = applicationsByStatus[ApplicationStatus.HIRED] || 0;
    const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus,
      jobsByStatus,
      averageApplicationsPerJob,
      hiringRate,
    };
  }

  /**
   * Transform user entity to NGO DTO with profile information
   */
  private async transformUserToNgoDto(user: User): Promise<AdminNgoDto> {
    const profile = user.nonprofitProfile;

    const dto: AdminNgoDto = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orgName: profile?.orgName || 'Unknown Organization',
      logoUrl: profile?.logoUrl,
      website: profile?.website,
      mission: profile?.mission,
      values: profile?.values,
      sizeLabel: profile?.sizeLabel,
      orgType: profile?.orgType,
      industry: profile?.industry,
      foundedOn: profile?.foundedOn,
      taxId: profile?.taxId,
      country: profile?.country,
      state: profile?.state,
      city: profile?.city,
      addressLine1: profile?.addressLine1,
      addressLine2: profile?.addressLine2,
      jobCount: 0,
      applicationCount: 0,
      activeJobCount: 0,
    };

    // Get job statistics
    const totalJobs = await this.jobRepository.count({
      where: { postedById: user.id },
    });

    const activeJobs = await this.jobRepository.count({
      where: { postedById: user.id, status: JobStatus.PUBLISHED },
    });

    const totalApplications = await this.applicationRepository
      .createQueryBuilder('app')
      .leftJoin('app.job', 'job')
      .where('job.postedById = :ngoId', { ngoId: user.id })
      .getCount();

    dto.jobCount = totalJobs;
    dto.activeJobCount = activeJobs;
    dto.applicationCount = totalApplications;

    return dto;
  }
}
