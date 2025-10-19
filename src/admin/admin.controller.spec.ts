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
    getPerformanceMetrics: jest.fn(),
    getActivityFeed: jest.fn(),
    getRecommendations: jest.fn(),
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

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', async () => {
      const mockMetrics = {
        period: '30d',
        userGrowth: [
          { date: '2024-01-01', count: 100 },
          { date: '2024-01-02', count: 120 },
        ],
        jobPostings: [
          { date: '2024-01-01', count: 50 },
          { date: '2024-01-02', count: 60 },
        ],
        applications: [
          { date: '2024-01-01', count: 200 },
          { date: '2024-01-02', count: 250 },
        ],
        conversionRates: {
          applicationToHire: 0.15,
          jobViewToApplication: 0.08,
        },
      };

      mockAdminService.getPerformanceMetrics.mockResolvedValue(mockMetrics);

      const result = await controller.getPerformanceMetrics('30d');

      expect(result).toEqual(mockMetrics);
      expect(mockAdminService.getPerformanceMetrics).toHaveBeenCalledWith('30d');
    });
  });

  describe('getActivityFeed', () => {
    it('should return activity feed', async () => {
      const mockActivity = {
        activities: [
          {
            id: 'activity-1',
            type: 'USER_REGISTRATION',
            description: 'New user registered',
            timestamp: new Date(),
            metadata: { userId: 'user-1', email: 'user@example.com' },
          },
          {
            id: 'activity-2',
            type: 'JOB_POSTED',
            description: 'New job posted',
            timestamp: new Date(),
            metadata: { jobId: 'job-1', title: 'Software Developer' },
          },
        ],
        total: 2,
      };

      mockAdminService.getActivityFeed.mockResolvedValue(mockActivity);

      const result = await controller.getActivityFeed(10);

      expect(result).toEqual(mockActivity);
      expect(mockAdminService.getActivityFeed).toHaveBeenCalledWith(10);
    });
  });

  describe('getRecommendations', () => {
    it('should return AI recommendations', async () => {
      const mockRecommendations = {
        insights: [
          {
            type: 'PERFORMANCE_INSIGHT',
            title: 'High Application Volume',
            description: 'Job postings are receiving 3x more applications than average',
            priority: 'HIGH',
            actionable: true,
          },
        ],
        suggestions: [
          {
            type: 'OPTIMIZATION_SUGGESTION',
            title: 'Improve Job Descriptions',
            description: 'Add more specific requirements to reduce irrelevant applications',
            impact: 'MEDIUM',
          },
        ],
        trends: {
          popularSkills: ['React', 'Node.js', 'TypeScript'],
          emergingSkills: ['AI/ML', 'Blockchain'],
          jobCategories: ['Software Development', 'Data Science'],
        },
      };

      mockAdminService.getRecommendations.mockResolvedValue(mockRecommendations);

      const result = await controller.getRecommendations();

      expect(result).toEqual(mockRecommendations);
      expect(mockAdminService.getRecommendations).toHaveBeenCalled();
    });
  });
});
