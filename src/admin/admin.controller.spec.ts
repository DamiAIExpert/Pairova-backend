import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    getDashboardStats: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUserStatus: jest.fn(),
    deleteUser: jest.fn(),
    getJobSeekers: jest.fn(),
    getJobSeekerById: jest.fn(),
    updateJobSeeker: jest.fn(),
    getNGOs: jest.fn(),
    getNGOById: jest.fn(),
    updateNGO: jest.fn(),
    getApplications: jest.fn(),
    getApplicationById: jest.fn(),
    updateApplicationStatus: jest.fn(),
    getFeedback: jest.fn(),
    getFeedbackById: jest.fn(),
    updateFeedbackStatus: jest.fn(),
    deleteFeedback: jest.fn(),
    getAuditLogs: jest.fn(),
    getLandingPageContent: jest.fn(),
    updateLandingPageContent: jest.fn(),
    getEmailSettings: jest.fn(),
    updateEmailSettings: jest.fn(),
    getSmsSettings: jest.fn(),
    updateSmsSettings: jest.fn(),
    testEmailSettings: jest.fn(),
    testSmsSettings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        totalJobSeekers: 80,
        totalNGOs: 20,
        totalJobs: 50,
        totalApplications: 200,
        pendingApplications: 30,
        approvedApplications: 150,
        rejectedApplications: 20,
        activeJobs: 45,
        inactiveJobs: 5,
        recentApplications: [],
        popularJobs: [],
        userGrowth: [],
        applicationTrends: [],
      };

      mockAdminService.getDashboardStats.mockResolvedValue(mockStats);

      const result = await controller.getDashboardStats();

      expect(result).toEqual(mockStats);
      expect(mockAdminService.getDashboardStats).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = {
        users: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            role: Role.APPLICANT,
            isVerified: true,
            createdAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        role: Role.APPLICANT,
        search: 'test',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      mockAdminService.getUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsers(queryParams);

      expect(result).toEqual(mockUsers);
      expect(mockAdminService.getUsers).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'user1@example.com',
        role: Role.APPLICANT,
        isVerified: true,
        createdAt: new Date(),
      };

      mockAdminService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('user-1');

      expect(result).toEqual(mockUser);
      expect(mockAdminService.getUserById).toHaveBeenCalledWith('user-1');
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      const updateDto = {
        isVerified: true,
        isActive: true,
      };

      const mockUpdatedUser = {
        id: 'user-1',
        email: 'user1@example.com',
        isVerified: true,
        isActive: true,
        updatedAt: new Date(),
      };

      mockAdminService.updateUserStatus.mockResolvedValue(mockUpdatedUser);

      const result = await controller.updateUserStatus('user-1', updateDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockAdminService.updateUserStatus).toHaveBeenCalledWith('user-1', updateDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      mockAdminService.deleteUser.mockResolvedValue({ message: 'User deleted successfully' });

      const result = await controller.deleteUser('user-1');

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockAdminService.deleteUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getJobSeekers', () => {
    it('should return paginated job seekers', async () => {
      const mockJobSeekers = {
        jobSeekers: [
          {
            id: 'seeker-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            profile: {
              skills: ['React', 'Node.js'],
              experience: '2 years',
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        search: 'John',
        skills: ['React'],
        experience: '2 years',
        sortBy: 'firstName',
        sortOrder: 'ASC',
      };

      mockAdminService.getJobSeekers.mockResolvedValue(mockJobSeekers);

      const result = await controller.getJobSeekers(queryParams);

      expect(result).toEqual(mockJobSeekers);
      expect(mockAdminService.getJobSeekers).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getNGOs', () => {
    it('should return paginated NGOs', async () => {
      const mockNGOs = {
        ngos: [
          {
            id: 'ngo-1',
            orgName: 'Test NGO',
            email: 'ngo@example.com',
            isVerified: true,
            profile: {
              description: 'A test NGO',
              website: 'https://testngo.org',
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        search: 'Test',
        isVerified: true,
        sortBy: 'orgName',
        sortOrder: 'ASC',
      };

      mockAdminService.getNGOs.mockResolvedValue(mockNGOs);

      const result = await controller.getNGOs(queryParams);

      expect(result).toEqual(mockNGOs);
      expect(mockAdminService.getNGOs).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getApplications', () => {
    it('should return paginated applications', async () => {
      const mockApplications = {
        applications: [
          {
            id: 'app-1',
            jobId: 'job-1',
            applicantId: 'applicant-1',
            status: 'PENDING',
            appliedAt: new Date(),
            job: {
              title: 'Software Developer',
              orgName: 'Test Company',
            },
            applicant: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        status: 'PENDING',
        jobId: 'job-1',
        applicantId: 'applicant-1',
        sortBy: 'appliedAt',
        sortOrder: 'DESC',
      };

      mockAdminService.getApplications.mockResolvedValue(mockApplications);

      const result = await controller.getApplications(queryParams);

      expect(result).toEqual(mockApplications);
      expect(mockAdminService.getApplications).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status', async () => {
      const updateDto = {
        status: 'APPROVED',
        adminNotes: 'Great candidate',
      };

      const mockUpdatedApplication = {
        id: 'app-1',
        status: 'APPROVED',
        adminNotes: 'Great candidate',
        updatedAt: new Date(),
      };

      mockAdminService.updateApplicationStatus.mockResolvedValue(mockUpdatedApplication);

      const result = await controller.updateApplicationStatus('app-1', updateDto);

      expect(result).toEqual(mockUpdatedApplication);
      expect(mockAdminService.updateApplicationStatus).toHaveBeenCalledWith('app-1', updateDto);
    });
  });

  describe('getFeedback', () => {
    it('should return paginated feedback', async () => {
      const mockFeedback = {
        feedback: [
          {
            id: 'feedback-1',
            userId: 'user-1',
            type: 'BUG_REPORT',
            subject: 'Login issue',
            message: 'Cannot login to the platform',
            status: 'OPEN',
            createdAt: new Date(),
            user: {
              email: 'user@example.com',
              role: Role.APPLICANT,
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        type: 'BUG_REPORT',
        status: 'OPEN',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      mockAdminService.getFeedback.mockResolvedValue(mockFeedback);

      const result = await controller.getFeedback(queryParams);

      expect(result).toEqual(mockFeedback);
      expect(mockAdminService.getFeedback).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const mockAuditLogs = {
        logs: [
          {
            id: 'log-1',
            userId: 'user-1',
            action: 'USER_LOGIN',
            entityType: 'User',
            entityId: 'user-1',
            details: { ip: '192.168.1.1' },
            timestamp: new Date(),
            user: {
              email: 'user@example.com',
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const queryParams = {
        page: 1,
        limit: 20,
        action: 'USER_LOGIN',
        userId: 'user-1',
        entityType: 'User',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        sortBy: 'timestamp',
        sortOrder: 'DESC',
      };

      mockAdminService.getAuditLogs.mockResolvedValue(mockAuditLogs);

      const result = await controller.getAuditLogs(queryParams);

      expect(result).toEqual(mockAuditLogs);
      expect(mockAdminService.getAuditLogs).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getLandingPageContent', () => {
    it('should return landing page content', async () => {
      const mockContent = {
        heroSection: {
          title: 'Welcome to Pairova',
          subtitle: 'Connect with opportunities',
          backgroundImage: 'hero-bg.jpg',
        },
        featuresSection: {
          title: 'Our Features',
          features: [
            {
              title: 'Job Matching',
              description: 'AI-powered job matching',
              icon: 'job-icon.svg',
            },
          ],
        },
        statisticsSection: {
          title: 'Our Impact',
          stats: [
            {
              label: 'Jobs Posted',
              value: 1000,
            },
          ],
        },
        testimonialsSection: {
          title: 'What People Say',
          testimonials: [],
        },
        ctaSection: {
          title: 'Get Started Today',
          subtitle: 'Join thousands of job seekers',
          buttonText: 'Sign Up Now',
        },
      };

      mockAdminService.getLandingPageContent.mockResolvedValue(mockContent);

      const result = await controller.getLandingPageContent();

      expect(result).toEqual(mockContent);
      expect(mockAdminService.getLandingPageContent).toHaveBeenCalled();
    });
  });

  describe('updateLandingPageContent', () => {
    it('should update landing page content', async () => {
      const updateDto = {
        heroSection: {
          title: 'Updated Title',
          subtitle: 'Updated subtitle',
        },
      };

      const mockUpdatedContent = {
        id: 'content-1',
        ...updateDto,
        updatedAt: new Date(),
      };

      mockAdminService.updateLandingPageContent.mockResolvedValue(mockUpdatedContent);

      const result = await controller.updateLandingPageContent(updateDto);

      expect(result).toEqual(mockUpdatedContent);
      expect(mockAdminService.updateLandingPageContent).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('getEmailSettings', () => {
    it('should return email settings', async () => {
      const mockSettings = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'admin@example.com',
        smtpSecure: true,
        fromEmail: 'noreply@example.com',
        fromName: 'Pairova',
        isActive: true,
      };

      mockAdminService.getEmailSettings.mockResolvedValue(mockSettings);

      const result = await controller.getEmailSettings();

      expect(result).toEqual(mockSettings);
      expect(mockAdminService.getEmailSettings).toHaveBeenCalled();
    });
  });

  describe('updateEmailSettings', () => {
    it('should update email settings', async () => {
      const updateDto = {
        smtpHost: 'smtp.outlook.com',
        smtpPort: 587,
        smtpUser: 'admin@outlook.com',
        smtpPassword: 'new-password',
        fromEmail: 'noreply@outlook.com',
        fromName: 'Pairova Platform',
        isActive: true,
      };

      const mockUpdatedSettings = {
        id: 'email-settings-1',
        ...updateDto,
        updatedAt: new Date(),
      };

      mockAdminService.updateEmailSettings.mockResolvedValue(mockUpdatedSettings);

      const result = await controller.updateEmailSettings(updateDto);

      expect(result).toEqual(mockUpdatedSettings);
      expect(mockAdminService.updateEmailSettings).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('testEmailSettings', () => {
    it('should test email settings', async () => {
      const testDto = {
        testEmail: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email',
      };

      const mockTestResult = {
        success: true,
        message: 'Test email sent successfully',
        sentAt: new Date(),
      };

      mockAdminService.testEmailSettings.mockResolvedValue(mockTestResult);

      const result = await controller.testEmailSettings(testDto);

      expect(result).toEqual(mockTestResult);
      expect(mockAdminService.testEmailSettings).toHaveBeenCalledWith(testDto);
    });
  });
});
