import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../common/enums/notification-type.enum';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;

  const mockNotification: Notification = {
    id: 'notification-1',
    userId: 'user-1',
    type: NotificationType.JOB_MATCH,
    title: 'New Job Match',
    body: 'You have a new job match!',
    data: { jobId: 'job-1' },
    readAt: null,
    createdAt: new Date(),
    user: null,
  };

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getMany: jest.fn(),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(getRepositoryToken(Notification));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const userId = 'user-1';
      const type = NotificationType.JOB_MATCH;
      const title = 'New Job Match';
      const body = 'You have a new job match!';
      const data = { jobId: 'job-1' };

      jest.spyOn(notificationRepository, 'create').mockReturnValue(mockNotification as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue(mockNotification as any);

      const result = await service.createNotification(userId, type, title, body, data);

      expect(result).toEqual(mockNotification);
      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId,
        type,
        title,
        body,
        data,
      });
      expect(notificationRepository.save).toHaveBeenCalledWith(mockNotification);
    });

    it('should create a notification without data', async () => {
      const userId = 'user-1';
      const type = NotificationType.SYSTEM;
      const title = 'System Notification';
      const body = 'System message';

      const notificationWithoutData = { ...mockNotification, data: null };

      jest.spyOn(notificationRepository, 'create').mockReturnValue(notificationWithoutData as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue(notificationWithoutData as any);

      const result = await service.createNotification(userId, type, title, body);

      expect(result).toEqual(notificationWithoutData);
      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId,
        type,
        title,
        body,
        data: undefined,
      });
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications with pagination', async () => {
      const userId = 'user-1';
      const page = 1;
      const limit = 10;
      const unreadOnly = false;
      const mockNotifications = [mockNotification];
      const total = 1;
      const unreadCount = 0;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockNotifications, total]),
      };

      jest.spyOn(notificationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      // Mock the unread count calculation
      jest.spyOn(notificationRepository, 'count').mockResolvedValue(unreadCount);

      const result = await service.getUserNotifications(userId, page, limit, unreadOnly);

      expect(result).toEqual({
        notifications: mockNotifications,
        total,
        page,
        limit,
        unreadCount,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('notification.userId = :userId', { userId });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit);
    });

    it('should filter unread notifications when unreadOnly is true', async () => {
      const userId = 'user-1';
      const page = 1;
      const limit = 10;
      const unreadOnly = true;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest.spyOn(notificationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      // Mock the unread count calculation
      jest.spyOn(notificationRepository, 'count').mockResolvedValue(0);

      await service.getUserNotifications(userId, page, limit, unreadOnly);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('notification.readAt IS NULL');
    });

    it('should use default pagination values', async () => {
      const userId = 'user-1';
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest.spyOn(notificationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
      // Mock the unread count calculation
      jest.spyOn(notificationRepository, 'count').mockResolvedValue(0);

      await service.getUserNotifications(userId);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const notificationId = 'notification-1';
      const userId = 'user-1';

      jest.spyOn(notificationRepository, 'findOne').mockResolvedValue(mockNotification as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue({
        ...mockNotification,
        readAt: new Date(),
      } as any);

      const result = await service.markAsRead(notificationId, userId);

      expect(notificationRepository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId, userId },
      });
      expect(notificationRepository.save).toHaveBeenCalledWith({
        ...mockNotification,
        readAt: expect.any(Date),
      });
      expect(result.readAt).toBeDefined();
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'nonexistent-notification';
      const userId = 'user-1';

      jest.spyOn(notificationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.markAsRead(notificationId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for a user', async () => {
      const userId = 'user-1';
      const affectedCount = 5;

      jest.spyOn(notificationRepository, 'update').mockResolvedValue({ affected: affectedCount } as any);

      const result = await service.markAllAsRead(userId);

      expect(result).toEqual({
        message: 'All notifications marked as read',
        count: affectedCount,
      });
      expect(notificationRepository.update).toHaveBeenCalledWith(
        { userId, readAt: null },
        { readAt: expect.any(Date) }
      );
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const notificationId = 'notification-1';
      const userId = 'user-1';

      jest.spyOn(notificationRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.deleteNotification(notificationId, userId);

      expect(notificationRepository.delete).toHaveBeenCalledWith({
        id: notificationId,
        userId,
      });
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 'nonexistent-notification';
      const userId = 'user-1';

      jest.spyOn(notificationRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteNotification(notificationId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserNotificationStats', () => {
    it('should return notification statistics for a user', async () => {
      const userId = 'user-1';
      const mockStats = {
        total: 10,
        unread: 3,
        byType: {
          [NotificationType.JOB_MATCH]: 5,
          [NotificationType.APPLICATION_UPDATE]: 3,
          [NotificationType.SYSTEM]: 2,
          [NotificationType.INTERVIEW]: 0,
          [NotificationType.MESSAGE]: 0,
        },
      };

      // Mock the statistics methods
      jest.spyOn(notificationRepository, 'count')
        .mockResolvedValueOnce(10) // total count
        .mockResolvedValueOnce(3); // unread count
      
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { type: NotificationType.JOB_MATCH, count: '5' },
          { type: NotificationType.APPLICATION_UPDATE, count: '3' },
          { type: NotificationType.SYSTEM, count: '2' },
        ]),
      };
      jest.spyOn(notificationRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getUserNotificationStats(userId);

      expect(result).toEqual(mockStats);
    });
  });

  describe('createJobMatchNotification', () => {
    it('should create job match notification successfully', async () => {
      const userId = 'user-1';
      const jobTitle = 'Software Developer';
      const jobId = 'job-1';

      const expectedNotification = {
        ...mockNotification,
        type: NotificationType.JOB_MATCH,
        title: 'New Job Match Found!',
        body: `We found a job that matches your profile: ${jobTitle}`,
        data: { jobId, jobTitle },
      };

      jest.spyOn(notificationRepository, 'create').mockReturnValue(expectedNotification as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue(expectedNotification as any);

      const result = await service.createJobMatchNotification(userId, jobTitle, jobId);

      expect(result).toEqual(expectedNotification);
      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId,
        type: NotificationType.JOB_MATCH,
        title: 'New Job Match Found!',
        body: `We found a job that matches your profile: ${jobTitle}`,
        data: { jobId, jobTitle },
      });
    });
  });

  describe('createApplicationUpdateNotification', () => {
    it('should create application update notification successfully', async () => {
      const userId = 'user-1';
      const jobTitle = 'Software Developer';
      const status = 'Accepted';
      const applicationId = 'app-1';

      const expectedNotification = {
        ...mockNotification,
        type: NotificationType.APPLICATION_UPDATE,
        title: 'Application Status Update',
        body: `Your application for "${jobTitle}" has been ${status.toLowerCase()}`,
        data: { jobTitle, status, applicationId },
      };

      jest.spyOn(notificationRepository, 'create').mockReturnValue(expectedNotification as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue(expectedNotification as any);

      const result = await service.createApplicationUpdateNotification(userId, jobTitle, status, applicationId);

      expect(result).toEqual(expectedNotification);
      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId,
        type: NotificationType.APPLICATION_UPDATE,
        title: 'Application Status Update',
        body: `Your application for "${jobTitle}" has been ${status.toLowerCase()}`,
        data: { jobTitle, status, applicationId },
      });
    });
  });

  describe('createInterviewNotification', () => {
    it('should create interview notification successfully', async () => {
      const userId = 'user-1';
      const jobTitle = 'Software Developer';
      const interviewDate = new Date('2024-01-15');
      const interviewId = 'interview-1';

      const expectedNotification = {
        ...mockNotification,
        type: NotificationType.INTERVIEW,
        title: 'Interview Scheduled',
        body: `You have an interview scheduled for "${jobTitle}" on ${interviewDate.toLocaleDateString()}`,
        data: { jobTitle, interviewDate, interviewId },
      };

      jest.spyOn(notificationRepository, 'create').mockReturnValue(expectedNotification as any);
      jest.spyOn(notificationRepository, 'save').mockResolvedValue(expectedNotification as any);

      const result = await service.createInterviewNotification(userId, jobTitle, interviewDate, interviewId);

      expect(result).toEqual(expectedNotification);
      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId,
        type: NotificationType.INTERVIEW,
        title: 'Interview Scheduled',
        body: `You have an interview scheduled for "${jobTitle}" on ${interviewDate.toLocaleDateString()}`,
        data: { jobTitle, interviewDate, interviewId },
      });
    });
  });
});
