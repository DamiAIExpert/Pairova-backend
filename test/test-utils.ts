import { User } from '../src/users/shared/user.entity';
import { Role } from '../src/common/enums/role.enum';
import { JobStatus } from '../src/common/enums/job.enum';
import { JobPlacement } from '../src/common/enums/job.enum';
import { EmploymentType } from '../src/common/enums/employment-type.enum';
import { NotificationType } from '../src/common/enums/notification-type.enum';
import { Notification } from '../src/notifications/entities/notification.entity';
import { Job } from '../src/jobs/entities/job.entity';

/**
 * Test utilities for creating mock objects and common test helpers
 */
export class TestUtils {
  /**
   * Create a mock user object
   */
  static createMockUser(overrides: Partial<User> = {}): User {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      role: Role.APPLICANT,
      passwordHash: 'hashed-password',
      phone: '+1234567890',
      isVerified: false,
      emailVerificationToken: 'verification-token',
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      applicantProfile: null,
      nonprofitOrg: null,
      ...overrides,
    } as User;

    // Add nonprofitProfile getter
    Object.defineProperty(user, 'nonprofitProfile', {
      get: function() {
        return this.nonprofitOrg;
      },
      enumerable: true,
      configurable: true
    });

    return user;
  }

  /**
   * Create a mock admin user
   */
  static createMockAdminUser(overrides: Partial<User> = {}): User {
    return this.createMockUser({
      id: 'admin-1',
      email: 'admin@example.com',
      role: Role.ADMIN,
      isVerified: true,
      ...overrides,
    });
  }

  /**
   * Create a mock nonprofit user
   */
  static createMockNonprofitUser(overrides: Partial<User> = {}): User {
    return this.createMockUser({
      id: 'nonprofit-1',
      email: 'nonprofit@example.com',
      role: Role.NONPROFIT,
      isVerified: true,
      ...overrides,
    });
  }

  /**
   * Create a mock job object
   */
  static createMockJob(overrides: Partial<Job> = {}): Job {
    return {
      id: 'job-1',
      title: 'Software Developer',
      description: 'A great software development position',
      placement: JobPlacement.REMOTE,
      status: JobStatus.DRAFT,
      employmentType: EmploymentType.FULL_TIME,
      postedById: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      applications: [],
      ...overrides,
    } as Job;
  }

  /**
   * Create a mock notification object
   */
  static createMockNotification(overrides: Partial<Notification> = {}): Notification {
    return {
      id: 'notification-1',
      userId: 'user-1',
      type: NotificationType.JOB_MATCH,
      title: 'New Job Match',
      body: 'You have a new job match!',
      data: { jobId: 'job-1' },
      readAt: null,
      createdAt: new Date(),
      user: null,
      ...overrides,
    } as Notification;
  }

  /**
   * Create a mock repository with common methods
   */
  static createMockRepository() {
    return {
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
        getCount: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
      })),
    };
  }

  /**
   * Create a mock query builder
   */
  static createMockQueryBuilder() {
    return {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getMany: jest.fn(),
      getCount: jest.fn(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };
  }

  /**
   * Create a mock HTTP service
   */
  static createMockHttpService() {
    return {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
  }

  /**
   * Create a mock config service
   */
  static createMockConfigService(config: Record<string, any> = {}) {
    return {
      get: jest.fn((key: string) => config[key]),
    };
  }

  /**
   * Create a mock JWT service
   */
  static createMockJwtService() {
    return {
      sign: jest.fn(),
      verify: jest.fn(),
    };
  }

  /**
   * Create a mock email service
   */
  static createMockEmailService() {
    return {
      sendFromTemplate: jest.fn(),
      sendEmail: jest.fn(),
    };
  }

  /**
   * Create a mock OTP service
   */
  static createMockOtpService() {
    return {
      generateOtp: jest.fn(),
      verifyOtp: jest.fn(),
      validateOtp: jest.fn(),
      consumeOtp: jest.fn(),
    };
  }

  /**
   * Create a mock users service
   */
  static createMockUsersService() {
    return {
      findByEmailWithPassword: jest.fn(),
      findOneById: jest.fn(),
      findOneByIdWithProfile: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      markEmailAsVerified: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      updatePassword: jest.fn(),
    };
  }

  /**
   * Wait for a specified amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a mock pagination result
   */
  static createMockPaginationResult<T>(items: T[], total: number = items.length, page: number = 1, limit: number = 10) {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a mock API response
   */
  static createMockApiResponse<T>(data: T, status: number = 200) {
    return {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: {},
    };
  }

  /**
   * Create a mock error response
   */
  static createMockErrorResponse(message: string, status: number = 400) {
    return {
      response: {
        status,
        data: { error: message },
      },
    };
  }
}

/**
 * Common test constants
 */
export const TEST_CONSTANTS = {
  USER_ID: 'user-1',
  ADMIN_ID: 'admin-1',
  NONPROFIT_ID: 'nonprofit-1',
  JOB_ID: 'job-1',
  NOTIFICATION_ID: 'notification-1',
  APPLICATION_ID: 'application-1',
  EMAIL: 'test@example.com',
  PASSWORD: 'password123',
  HASHED_PASSWORD: 'hashed-password',
  JWT_TOKEN: 'jwt-token',
  REFRESH_TOKEN: 'refresh-token',
  OTP_CODE: '123456',
  PHONE: '+1234567890',
} as const;

/**
 * Common test data
 */
export const TEST_DATA = {
  USERS: {
    APPLICANT: TestUtils.createMockUser(),
    ADMIN: TestUtils.createMockAdminUser(),
    NONPROFIT: TestUtils.createMockNonprofitUser(),
  },
  JOBS: {
    DRAFT: TestUtils.createMockJob({ status: JobStatus.DRAFT }),
    PUBLISHED: TestUtils.createMockJob({ status: JobStatus.PUBLISHED }),
    CLOSED: TestUtils.createMockJob({ status: JobStatus.CLOSED }),
  },
  NOTIFICATIONS: {
    JOB_MATCH: TestUtils.createMockNotification({ type: NotificationType.JOB_MATCH }),
    APPLICATION_UPDATE: TestUtils.createMockNotification({ type: NotificationType.APPLICATION_UPDATE }),
    INTERVIEW: TestUtils.createMockNotification({ type: NotificationType.INTERVIEW }),
  },
} as const;
