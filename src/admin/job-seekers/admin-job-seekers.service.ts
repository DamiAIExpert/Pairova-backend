// src/admin/job-seekers/admin-job-seekers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Education } from '../../profiles/education/entities/education.entity';
import { Experience } from '../../profiles/experience/entities/experience.entity';
import { Certification } from '../../profiles/certifications/entities/certification.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminJobSeekerDto, AdminJobSeekerListDto, AppliedJobDto, AppliedJobsListDto } from './dto/admin-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { Role } from '../../common/enums/role.enum';

/**
 * @class AdminJobSeekersService
 * @description Provides business logic for admin job seeker management operations.
 */
@Injectable()
export class AdminJobSeekersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantRepository: Repository<ApplicantProfile>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
  ) {}

  /**
   * Get paginated list of all job seekers with optional filtering
   */
  async findAll(
    paginationDto: PaginationDto,
    filters: { search?: string } = {},
  ): Promise<AdminJobSeekerListDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { search } = filters;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.applicantProfile', 'applicant')
      .where('user.role = :role', { role: Role.APPLICANT })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR applicant.firstName ILIKE :search OR applicant.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    // Transform users to include profile data and application counts
    const jobSeekerData = await Promise.all(
      users.map(async (user) => this.transformUserToJobSeekerDto(user)),
    );

    return {
      data: jobSeekerData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed information about a specific job seeker
   */
  async findOne(id: string): Promise<AdminJobSeekerDto> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.APPLICANT },
      relations: ['applicantProfile'],
    });

    if (!user) {
      throw new NotFoundException('Job seeker not found');
    }

    return this.transformUserToJobSeekerDto(user);
  }

  /**
   * Update job seeker profile information
   */
  async update(id: string, updateJobSeekerDto: UpdateJobSeekerDto): Promise<AdminJobSeekerDto> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.APPLICANT },
      relations: ['applicantProfile'],
    });

    if (!user) {
      throw new NotFoundException('Job seeker not found');
    }

    // Update user fields
    if (updateJobSeekerDto.isVerified !== undefined) {
      user.isVerified = updateJobSeekerDto.isVerified;
    }
    if (updateJobSeekerDto.phone) {
      user.phone = updateJobSeekerDto.phone;
    }

    await this.userRepository.save(user);

    // Update applicant profile fields
    if (user.applicantProfile) {
      const profile = user.applicantProfile;
      Object.assign(profile, {
        firstName: updateJobSeekerDto.firstName,
        lastName: updateJobSeekerDto.lastName,
        gender: updateJobSeekerDto.gender,
        dob: updateJobSeekerDto.dob ? new Date(updateJobSeekerDto.dob) : undefined,
        bio: updateJobSeekerDto.bio,
        country: updateJobSeekerDto.country,
        state: updateJobSeekerDto.state,
        city: updateJobSeekerDto.city,
        portfolioUrl: updateJobSeekerDto.portfolioUrl,
      });
      await this.applicantRepository.save(profile);
    }

    return this.transformUserToJobSeekerDto(user);
  }

  /**
   * Delete or suspend a job seeker account
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id, role: Role.APPLICANT },
    });

    if (!user) {
      throw new NotFoundException('Job seeker not found');
    }

    // Soft delete by marking as unverified
    user.isVerified = false;
    await this.userRepository.save(user);

    return { message: 'Job seeker account suspended successfully' };
  }

  /**
   * Get all applied jobs for a specific job seeker
   */
  async getAppliedJobs(id: string, paginationDto: PaginationDto): Promise<AppliedJobsListDto> {
    const { page = 1, limit = 10 } = paginationDto;

    const [applications, total] = await this.applicationRepository.findAndCount({
      where: { applicantId: id },
      relations: ['job', 'job.postedBy', 'job.postedBy.nonprofitProfile'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const appliedJobsData: AppliedJobDto[] = applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job.title,
      orgName: app.job.postedBy.nonprofitProfile?.orgName || 'Unknown Organization',
      status: app.status,
      appliedAt: app.createdAt,
      matchScore: undefined, // TODO: Add match score calculation
    }));

    return {
      data: appliedJobsData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get education records for a job seeker
   */
  async getEducation(id: string) {
    return this.educationRepository.find({
      where: { applicantId: id },
      order: { endDate: 'DESC' },
    });
  }

  /**
   * Get experience records for a job seeker
   */
  async getExperience(id: string) {
    return this.experienceRepository.find({
      where: { applicantId: id },
      order: { endDate: 'DESC' },
    });
  }

  /**
   * Get certification records for a job seeker
   */
  async getCertifications(id: string) {
    return this.certificationRepository.find({
      where: { applicantId: id },
      order: { issuedDate: 'DESC' },
    });
  }

  /**
   * Transform user entity to job seeker DTO with profile information
   */
  private async transformUserToJobSeekerDto(user: User): Promise<AdminJobSeekerDto> {
    const profile = user.applicantProfile;
    
    const dto: AdminJobSeekerDto = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Unknown',
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      gender: profile?.gender,
      dob: profile?.dob,
      bio: profile?.bio,
      country: profile?.country,
      state: profile?.state,
      city: profile?.city,
      photoUrl: profile?.photoUrl,
      portfolioUrl: profile?.portfolioUrl,
      applicationCount: 0,
      applicationDate: undefined,
      currentStatus: undefined,
    };

    // Get application statistics
    const applications = await this.applicationRepository.find({
      where: { applicantId: user.id },
      order: { createdAt: 'DESC' },
    });

    dto.applicationCount = applications.length;
    
    if (applications.length > 0) {
      dto.applicationDate = applications[0].createdAt.toISOString().split('T')[0];
      dto.currentStatus = applications[0].status;
    }

    return dto;
  }
}
