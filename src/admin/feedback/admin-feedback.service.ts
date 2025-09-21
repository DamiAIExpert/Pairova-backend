// src/admin/feedback/admin-feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Feedback, FeedbackStatus, FeedbackPriority, FeedbackCategory } from './entities/feedback.entity';
import { User } from '../../users/shared/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  FeedbackDto, 
  FeedbackListDto, 
  CreateFeedbackDto, 
  UpdateFeedbackDto 
} from './dto/feedback.dto';

/**
 * @class AdminFeedbackService
 * @description Provides business logic for admin feedback management operations.
 */
@Injectable()
export class AdminFeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get paginated list of all feedback with optional filtering
   */
  async findAll(
    paginationDto: PaginationDto,
    filters: { 
      status?: string; 
      priority?: string; 
      category?: string; 
      search?: string;
    } = {},
  ): Promise<FeedbackListDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { status, priority, category, search } = filters;

    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.assignedTo', 'assignedTo')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('feedback.createdAt', 'DESC');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('feedback.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('feedback.priority = :priority', { priority });
    }

    if (category) {
      queryBuilder.andWhere('feedback.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(feedback.title ILIKE :search OR feedback.description ILIKE :search OR feedback.userName ILIKE :search OR feedback.userEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [feedback, total] = await queryBuilder.getManyAndCount();

    // Transform feedback to DTOs
    const feedbackData = feedback.map((item) => this.transformToDto(item));

    return {
      data: feedbackData,
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed information about a specific feedback item
   */
  async findOne(id: string): Promise<FeedbackDto> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.transformToDto(feedback);
  }

  /**
   * Create new feedback item
   */
  async create(createFeedbackDto: CreateFeedbackDto): Promise<FeedbackDto> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    const savedFeedback = await this.feedbackRepository.save(feedback);
    
    return this.transformToDto(savedFeedback);
  }

  /**
   * Update feedback item
   */
  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<FeedbackDto> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // Update fields
    Object.assign(feedback, updateFeedbackDto);
    const savedFeedback = await this.feedbackRepository.save(feedback);

    return this.transformToDto(savedFeedback);
  }

  /**
   * Delete feedback item
   */
  async remove(id: string): Promise<{ message: string }> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    await this.feedbackRepository.remove(feedback);

    return { message: 'Feedback deleted successfully' };
  }

  /**
   * Get feedback statistics
   */
  async getStatistics() {
    const total = await this.feedbackRepository.count();
    
    const statusCounts = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('feedback.status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feedback.status')
      .getRawMany();

    const priorityCounts = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('feedback.priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feedback.priority')
      .getRawMany();

    const categoryCounts = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('feedback.category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('feedback.category')
      .getRawMany();

    // This month's feedback
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonth = await this.feedbackRepository.count({
      where: {
        createdAt: Between(startOfMonth, new Date()),
      },
    });

    // Resolved feedback this month
    const resolvedThisMonth = await this.feedbackRepository.count({
      where: {
        status: FeedbackStatus.RESOLVED,
        updatedAt: Between(startOfMonth, new Date()),
      },
    });

    // Average resolution time (for resolved feedback)
    const resolvedFeedback = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('AVG(EXTRACT(EPOCH FROM (feedback.updatedAt - feedback.createdAt)))', 'avgResolutionTime')
      .where('feedback.status = :status', { status: FeedbackStatus.RESOLVED })
      .getRawOne();

    const avgResolutionTimeHours = resolvedFeedback?.avgResolutionTime 
      ? Math.round(resolvedFeedback.avgResolutionTime / 3600 * 100) / 100 
      : 0;

    return {
      total,
      thisMonth,
      resolvedThisMonth,
      avgResolutionTimeHours,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.feedback_status] = parseInt(item.count);
        return acc;
      }, {}),
      priorityCounts: priorityCounts.reduce((acc, item) => {
        acc[item.feedback_priority] = parseInt(item.count);
        return acc;
      }, {}),
      categoryCounts: categoryCounts.reduce((acc, item) => {
        acc[item.feedback_category] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  /**
   * Transform feedback entity to DTO
   */
  private transformToDto(feedback: Feedback): FeedbackDto {
    return {
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      category: feedback.category,
      status: feedback.status,
      priority: feedback.priority,
      userEmail: feedback.userEmail,
      userName: feedback.userName,
      userId: feedback.userId,
      adminNotes: feedback.adminNotes,
      assignedToId: feedback.assignedToId,
      assignedToName: feedback.assignedTo?.email || undefined,
      browserInfo: feedback.browserInfo,
      deviceInfo: feedback.deviceInfo,
      pageUrl: feedback.pageUrl,
      metadata: feedback.metadata,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }
}
