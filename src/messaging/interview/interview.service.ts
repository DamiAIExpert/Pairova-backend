// src/messaging/interview/interview.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview, InterviewStatus } from './entities/interview.entity';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { User } from '../../users/shared/user.entity';
import { Role } from '../../common/enums/role.enum';
import { Application } from '../../jobs/entities/application.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    @InjectRepository(Application) // To verify application ownership
    private readonly applicationRepository: Repository<Application>,
  ) {}

  /**
   * Schedules a new interview.
   * @param dto - The interview scheduling data.
   * @param scheduler - The user scheduling the interview.
   * @returns The newly created interview.
   */
  async schedule(dto: ScheduleInterviewDto, scheduler: User): Promise<Interview> {
    const application = await this.applicationRepository.findOne({
        where: { id: dto.applicationId },
        relations: ['job']
    });

    if (!application) {
        throw new NotFoundException(`Application with ID ${dto.applicationId} not found.`);
    }

    // Authorization: Only the nonprofit who owns the job can schedule an interview
    if (scheduler.role !== Role.NONPROFIT || application.job.orgUserId !== scheduler.id) {
        throw new ForbiddenException('You are not authorized to schedule an interview for this application.');
    }

    const interview = this.interviewRepository.create({
      ...dto,
      scheduledById: scheduler.id,
    });

    return this.interviewRepository.save(interview);
  }

  /**
   * Finds a single interview by its ID.
   * @param id - The UUID of the interview.
   * @returns The found interview.
   */
  async findOne(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({ where: { id }, relations: ['application', 'application.job', 'application.applicant'] });
    if (!interview) {
      throw new NotFoundException(`Interview with ID "${id}" not found.`);
    }
    return interview;
  }
}
