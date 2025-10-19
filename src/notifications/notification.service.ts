import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/shared/user.entity';
import { NotificationType } from '../common/enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      body,
      data,
    });

    return this.notificationRepository.save(notification);
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  }> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (unreadOnly) {
      queryBuilder.andWhere('notification.readAt IS NULL');
    }

    const [notifications, total] = await queryBuilder.getManyAndCount();

    const unreadCount = await this.notificationRepository.count({
      where: { userId, readAt: null },
    });

    return {
      notifications,
      total,
      page,
      limit,
      unreadCount,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      return this.notificationRepository.save(notification);
    }

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ message: string; count: number }> {
    const result = await this.notificationRepository.update(
      { userId, readAt: null },
      { readAt: new Date() },
    );

    return {
      message: 'All notifications marked as read',
      count: result.affected || 0,
    };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const result = await this.notificationRepository.delete({
      id: notificationId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Notification not found');
    }
  }

  /**
   * Get notification statistics for a user
   */
  async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
  }> {
    const total = await this.notificationRepository.count({ where: { userId } });
    const unread = await this.notificationRepository.count({
      where: { userId, readAt: null },
    });

    const byType = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('notification.userId = :userId', { userId })
      .groupBy('notification.type')
      .getRawMany();

    const typeStats = Object.values(NotificationType).reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {} as Record<NotificationType, number>);

    byType.forEach(item => {
      typeStats[item.type as NotificationType] = parseInt(item.count);
    });

    return {
      total,
      unread,
      byType: typeStats,
    };
  }

  /**
   * Create job-related notifications
   */
  async createJobMatchNotification(
    userId: string,
    jobTitle: string,
    jobId: string,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      NotificationType.JOB_MATCH,
      'New Job Match Found!',
      `We found a job that matches your profile: ${jobTitle}`,
      { jobId, jobTitle },
    );
  }

  async createApplicationUpdateNotification(
    userId: string,
    jobTitle: string,
    status: string,
    applicationId: string,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      NotificationType.APPLICATION_UPDATE,
      'Application Status Update',
      `Your application for "${jobTitle}" has been ${status.toLowerCase()}`,
      { jobTitle, status, applicationId },
    );
  }

  async createInterviewNotification(
    userId: string,
    jobTitle: string,
    interviewDate: Date,
    interviewId: string,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      NotificationType.INTERVIEW,
      'Interview Scheduled',
      `You have an interview scheduled for "${jobTitle}" on ${interviewDate.toLocaleDateString()}`,
      { jobTitle, interviewDate, interviewId },
    );
  }
}
