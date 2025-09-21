// src/admin/users/admin-users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminUserDto, AdminUserListDto } from './dto/admin-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { Role } from '../../common/enums/role.enum';

/**
 * @class AdminUsersService
 * @description Provides business logic for admin user management operations.
 */
@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantRepository: Repository<ApplicantProfile>,
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  /**
   * Get paginated list of all users with optional filtering
   */
  async findAll(
    paginationDto: PaginationDto,
    filters: { role?: Role; search?: string } = {},
  ): Promise<AdminUserListDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { role, search } = filters;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.applicantProfile', 'applicant')
      .leftJoinAndSelect('user.nonprofitProfile', 'nonprofit')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    // Apply filters
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR applicant.firstName ILIKE :search OR applicant.lastName ILIKE :search OR nonprofit.orgName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    // Transform users to include profile data and counts
    const userData = await Promise.all(
      users.map(async (user) => this.transformUserToAdminDto(user)),
    );

    return {
      data: userData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed information about a specific user
   */
  async findOne(id: string): Promise<AdminUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['applicantProfile', 'nonprofitProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transformUserToAdminDto(user);
  }

  /**
   * Update user status or basic information
   */
  async update(id: string, updateUserStatusDto: UpdateUserStatusDto): Promise<AdminUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['applicantProfile', 'nonprofitProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    Object.assign(user, updateUserStatusDto);
    await this.userRepository.save(user);

    return this.transformUserToAdminDto(user);
  }

  /**
   * Delete or suspend a user account
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by marking as unverified or actually delete
    // For safety, we'll mark as unverified first
    user.isVerified = false;
    await this.userRepository.save(user);

    return { message: 'User account suspended successfully' };
  }

  /**
   * Get all applications for a specific user
   */
  async getUserApplications(id: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const [applications, total] = await this.applicationRepository.findAndCount({
      where: { applicantId: id },
      relations: ['job', 'job.postedBy', 'job.postedBy.nonprofitProfile'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: applications,
      total,
      page,
      limit,
    };
  }

  /**
   * Transform user entity to admin DTO with profile information
   */
  private async transformUserToAdminDto(user: User): Promise<AdminUserDto> {
    const dto: AdminUserDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add profile-specific information
    if (user.role === Role.APPLICANT && user.applicantProfile) {
      const profile = user.applicantProfile;
      dto.firstName = profile.firstName;
      dto.lastName = profile.lastName;
      dto.photoUrl = profile.photoUrl;
      dto.city = profile.city;
      dto.country = profile.country;

      // Get application count
      const applicationCount = await this.applicationRepository.count({
        where: { applicantId: user.id },
      });
      dto.applicationCount = applicationCount;
    }

    if (user.role === Role.NONPROFIT && user.nonprofitProfile) {
      const profile = user.nonprofitProfile;
      dto.orgName = profile.orgName;
      dto.logoUrl = profile.logoUrl;
      dto.city = profile.city;
      dto.country = profile.country;

      // Get job count
      const jobCount = await this.jobRepository.count({
        where: { postedById: user.id },
      });
      dto.jobCount = jobCount;
    }

    return dto;
  }
}
