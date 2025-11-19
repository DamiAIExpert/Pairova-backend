import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../entities/saved-job.entity';
import { Job } from '../entities/job.entity';
import { User } from '../../users/shared/user.entity';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(SavedJob)
    private readonly savedJobsRepository: Repository<SavedJob>,
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    // Check if already saved first (faster check)
    const existingSavedJob = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });
    if (existingSavedJob) {
      throw new ConflictException('Job already saved');
    }

    // Check if job exists
    const job = await this.jobsRepository.findOne({ 
      where: { id: jobId },
      select: ['id'], // Only select id for faster query
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Create and save
    const savedJob = this.savedJobsRepository.create({
      userId,
      jobId,
    });

    return this.savedJobsRepository.save(savedJob);
  }

  async unsaveJob(userId: string, jobId: string): Promise<void> {
    const savedJob = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.savedJobsRepository.remove(savedJob);
  }

  async getSavedJobs(userId: string, page: number = 1, limit: number = 20): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [savedJobs, total] = await this.savedJobsRepository.findAndCount({
      where: { userId },
      relations: ['job', 'job.organization'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const jobs = savedJobs.map(savedJob => savedJob.job);

    return {
      jobs,
      total,
      page,
      limit,
    };
  }

  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    const savedJob = await this.savedJobsRepository.findOne({
      where: { userId, jobId },
    });

    return !!savedJob;
  }
}
