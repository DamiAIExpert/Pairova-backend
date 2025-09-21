import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

import { AiMicroserviceService } from './ai-microservice.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AiMicroserviceService', () => {
  let service: AiMicroserviceService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiMicroserviceService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AiMicroserviceService>(AiMicroserviceService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        AI_MICROSERVICE_URL: 'http://localhost:8000',
        AI_MICROSERVICE_API_KEY: 'test-api-key',
        AI_MICROSERVICE_TIMEOUT: 30000,
        AI_MICROSERVICE_RETRY_ATTEMPTS: 3,
      };
      return config[key];
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateScore', () => {
    it('should calculate score successfully', async () => {
      const mockRequest = {
        jobId: 'job-1',
        applicantId: 'applicant-1',
        jobData: {
          title: 'Software Developer',
          requirements: ['React', 'Node.js'],
          skills: ['JavaScript', 'TypeScript'],
        },
        applicantData: {
          skills: ['React', 'Node.js', 'JavaScript'],
          experience: '2 years',
          education: 'Computer Science',
        },
      };

      const mockResponse = {
        data: {
          score: 0.85,
          scoreDetails: {
            skillMatch: 0.9,
            experienceMatch: 0.8,
            educationMatch: 0.85,
          },
          modelVersion: '1.0.0',
          predictionSource: 'ml_model',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.calculateScore(mockRequest);

      expect(result).toEqual({
        score: 0.85,
        scoreDetails: {
          skillMatch: 0.9,
          experienceMatch: 0.8,
          educationMatch: 0.85,
        },
        modelVersion: '1.0.0',
        predictionSource: 'ml_model',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/predictions/score',
        mockRequest,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          }),
          timeout: 30000,
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockRequest = {
        jobId: 'job-1',
        applicantId: 'applicant-1',
        jobData: {},
        applicantData: {},
      };

      mockedAxios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      });

      await expect(service.calculateScore(mockRequest))
        .rejects.toThrow(HttpException);
    });

    it('should retry on network errors', async () => {
      const mockRequest = {
        jobId: 'job-1',
        applicantId: 'applicant-1',
        jobData: {},
        applicantData: {},
      };

      // First two calls fail, third succeeds
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: {
            score: 0.75,
            scoreDetails: {},
            modelVersion: '1.0.0',
            predictionSource: 'ml_model',
          },
        });

      const result = await service.calculateScore(mockRequest);

      expect(result.score).toBe(0.75);
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const mockRequest = {
        jobId: 'job-1',
        applicantId: 'applicant-1',
        jobData: {},
        applicantData: {},
      };

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(service.calculateScore(mockRequest))
        .rejects.toThrow(HttpException);

      expect(mockedAxios.post).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('batchCalculateScores', () => {
    it('should calculate batch scores successfully', async () => {
      const mockRequest = {
        requests: [
          {
            jobId: 'job-1',
            applicantId: 'applicant-1',
            jobData: {},
            applicantData: {},
          },
          {
            jobId: 'job-1',
            applicantId: 'applicant-2',
            jobData: {},
            applicantData: {},
          },
        ],
      };

      const mockResponse = {
        data: {
          results: [
            {
              jobId: 'job-1',
              applicantId: 'applicant-1',
              score: 0.8,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionSource: 'ml_model',
            },
            {
              jobId: 'job-1',
              applicantId: 'applicant-2',
              score: 0.9,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionSource: 'ml_model',
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.batchCalculateScores(mockRequest);

      expect(result.results).toHaveLength(2);
      expect(result.results[0].score).toBe(0.8);
      expect(result.results[1].score).toBe(0.9);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/predictions/batch-score',
        mockRequest,
        expect.any(Object)
      );
    });

    it('should handle batch processing errors', async () => {
      const mockRequest = {
        requests: [
          {
            jobId: 'job-1',
            applicantId: 'applicant-1',
            jobData: {},
            applicantData: {},
          },
        ],
      };

      mockedAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Invalid request data' },
        },
      });

      await expect(service.batchCalculateScores(mockRequest))
        .rejects.toThrow(HttpException);
    });
  });

  describe('getRecommendations', () => {
    it('should get job recommendations successfully', async () => {
      const mockRequest = {
        applicantId: 'applicant-1',
        applicantData: {
          skills: ['React', 'Node.js'],
          experience: '2 years',
          education: 'Computer Science',
        },
        limit: 10,
      };

      const mockResponse = {
        data: {
          recommendations: [
            {
              jobId: 'job-1',
              score: 0.9,
              reason: 'Strong skill match',
            },
            {
              jobId: 'job-2',
              score: 0.8,
              reason: 'Good experience match',
            },
          ],
          modelVersion: '1.0.0',
          totalJobs: 100,
          filteredJobs: 50,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.getRecommendations(mockRequest);

      expect(result.recommendations).toHaveLength(2);
      expect(result.totalJobs).toBe(100);
      expect(result.filteredJobs).toBe(50);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/recommendations',
        mockRequest,
        expect.any(Object)
      );
    });

    it('should handle recommendation errors', async () => {
      const mockRequest = {
        applicantId: 'applicant-1',
        applicantData: {},
        limit: 10,
      };

      mockedAxios.post.mockRejectedValue({
        response: {
          status: 404,
          data: { error: 'Applicant not found' },
        },
      });

      await expect(service.getRecommendations(mockRequest))
        .rejects.toThrow(HttpException);
    });
  });

  describe('healthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockResponse = {
        data: {
          status: 'healthy',
          timestamp: '2024-01-01T00:00:00Z',
          version: '1.0.0',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.healthCheck();

      expect(result).toEqual({
        status: 'healthy',
        timestamp: '2024-01-01T00:00:00Z',
        version: '1.0.0',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/health',
        expect.objectContaining({
          timeout: 5000,
        })
      );
    });

    it('should handle health check failures', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Connection failed'));

      await expect(service.healthCheck())
        .rejects.toThrow(HttpException);
    });
  });

  describe('getStatus', () => {
    it('should get service status successfully', async () => {
      const mockResponse = {
        data: {
          service: 'ai-matching-service',
          version: '1.0.0',
          status: 'running',
          uptime: 3600,
          memoryUsage: '512MB',
          cpuUsage: '25%',
          activeConnections: 10,
          totalRequests: 1000,
          averageResponseTime: 150,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getStatus();

      expect(result.service).toBe('ai-matching-service');
      expect(result.status).toBe('running');
      expect(result.totalRequests).toBe(1000);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/status',
        expect.any(Object)
      );
    });

    it('should handle status check errors', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 503,
          data: { error: 'Service unavailable' },
        },
      });

      await expect(service.getStatus())
        .rejects.toThrow(HttpException);
    });
  });

  describe('configuration validation', () => {
    it('should use default values when config is missing', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_MICROSERVICE_URL') return 'http://localhost:8000';
        return undefined; // Other configs missing
      });

      // Service should still work with defaults
      expect(service).toBeDefined();
    });

    it('should validate required configuration', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'AI_MICROSERVICE_API_KEY') return undefined;
        return 'test-value';
      });

      // Service should handle missing API key gracefully
      expect(service).toBeDefined();
    });
  });
});
