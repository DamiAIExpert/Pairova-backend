// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { Role } from '../common/enums/role.enum';

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
   * @returns {Promise<any>} An object containing various platform statistics.
   */
  async getDashboardStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const totalApplicants = await this.userRepository.count({ where: { role: Role.APPLICANT } });
    const totalNonprofits = await this.userRepository.count({ where: { role: Role.NONPROFIT } });
    const totalJobs = await this.jobRepository.count();
    const totalApplications = await this.applicationRepository.count();

    return {
      totalUsers,
      totalApplicants,
      totalNonprofits,
      totalJobs,
      totalApplications,
    };
  }
}
