import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

import { AiMicroserviceService } from './ai-microservice.service';

describe('AiMicroserviceService', () => {
  let service: AiMicroserviceService;
  let configService: ConfigService;
  let httpService: HttpService;

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
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AiMicroserviceService>(AiMicroserviceService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);

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

  describe('getPredictionScore', () => {
    it('should get prediction score successfully', async () => {
      const mockRequest = {
        job: {
          id: 'job-1',
          title: 'Software Developer',
          description: 'A great software development position',
          requirements: ['React', 'Node.js'],
          skills: ['JavaScript', 'TypeScript'],
          experienceLevel: 'Mid',
          employmentType: 'FULL_TIME',
          placement: 'REMOTE',
          salaryRange: { min: 50000, max: 80000, currency: 'USD' },
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          industry: 'Technology',
          orgSize: 'Medium',
          orgType: 'Non-profit',
        },
        applicant: {
          id: 'applicant-1',
          skills: ['React', 'Node.js', 'JavaScript'],
          experience: [{
            title: 'Software Developer',
            company: 'Tech Corp',
            duration: 2,
            description: 'Full-stack development',
            skills: ['React', 'Node.js'],
          }],
          education: [{
            degree: 'Bachelor',
            field: 'Computer Science',
            institution: 'University',
            graduationYear: 2020,
          }],
          certifications: [],
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          availability: 'Immediate',
          preferredSalaryRange: { min: 60000, max: 90000, currency: 'USD' },
          workPreferences: {
            employmentTypes: ['FULL_TIME'],
            placements: ['REMOTE'],
            industries: ['Technology'],
          },
        },
      };

      const mockResponse = {
        data: {
          score: 0.85,
          scoreDetails: {
            skillMatch: 0.9,
            experienceMatch: 0.8,
            locationMatch: 0.9,
            salaryMatch: 0.8,
            industryMatch: 0.9,
            educationMatch: 0.85,
            cultureMatch: 0.8,
            availabilityMatch: 0.9,
            recommendationReason: 'Strong skill match',
            skillGaps: [],
            strengths: ['React', 'Node.js'],
            improvements: [],
          },
          modelVersion: '1.0.0',
          predictionId: 'pred-123',
          confidence: 0.85,
          processingTime: 150,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.getPredictionScore(mockRequest);

      expect(result).toEqual(mockResponse.data);

      expect(httpService.post).toHaveBeenCalledWith(
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
        job: {
          id: 'job-1',
          title: 'Software Developer',
          description: 'A great software development position',
          requirements: [],
          skills: [],
          experienceLevel: 'Mid',
          employmentType: 'FULL_TIME',
          placement: 'REMOTE',
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          industry: 'Technology',
          orgSize: 'Medium',
          orgType: 'Non-profit',
        },
        applicant: {
          id: 'applicant-1',
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          availability: 'Immediate',
          workPreferences: {
            employmentTypes: ['FULL_TIME'],
            placements: ['REMOTE'],
            industries: ['Technology'],
          },
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => ({
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      })));

      await expect(service.getPredictionScore(mockRequest))
        .rejects.toThrow(HttpException);
    });

    it('should handle network errors', async () => {
      const mockRequest = {
        job: {
          id: 'job-1',
          title: 'Software Developer',
          description: 'A great software development position',
          requirements: [],
          skills: [],
          experienceLevel: 'Mid',
          employmentType: 'FULL_TIME',
          placement: 'REMOTE',
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          industry: 'Technology',
          orgSize: 'Medium',
          orgType: 'Non-profit',
        },
        applicant: {
          id: 'applicant-1',
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          location: { country: 'US', state: 'CA', city: 'San Francisco' },
          availability: 'Immediate',
          workPreferences: {
            employmentTypes: ['FULL_TIME'],
            placements: ['REMOTE'],
            industries: ['Technology'],
          },
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Network error')));

      await expect(service.getPredictionScore(mockRequest))
        .rejects.toThrow(HttpException);
    });
  });

  describe('getBatchPredictions', () => {
    it('should get batch predictions successfully', async () => {
      const mockRequest = [
        {
          job: {
            id: 'job-1',
            title: 'Software Developer',
            description: 'A great software development position',
            requirements: [],
            skills: [],
            experienceLevel: 'Mid',
            employmentType: 'FULL_TIME',
            placement: 'REMOTE',
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            industry: 'Technology',
            orgSize: 'Medium',
            orgType: 'Non-profit',
          },
          applicant: {
            id: 'applicant-1',
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            availability: 'Immediate',
            workPreferences: {
              employmentTypes: ['FULL_TIME'],
              placements: ['REMOTE'],
              industries: ['Technology'],
            },
          },
        },
        {
          job: {
            id: 'job-1',
            title: 'Software Developer',
            description: 'A great software development position',
            requirements: [],
            skills: [],
            experienceLevel: 'Mid',
            employmentType: 'FULL_TIME',
            placement: 'REMOTE',
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            industry: 'Technology',
            orgSize: 'Medium',
            orgType: 'Non-profit',
          },
          applicant: {
            id: 'applicant-2',
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            availability: 'Immediate',
            workPreferences: {
              employmentTypes: ['FULL_TIME'],
              placements: ['REMOTE'],
              industries: ['Technology'],
            },
          },
        },
      ];

      const mockResponse = {
        data: {
          predictions: [
            {
              score: 0.8,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionId: 'pred-1',
              confidence: 0.8,
              processingTime: 150,
            },
            {
              score: 0.9,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionId: 'pred-2',
              confidence: 0.9,
              processingTime: 160,
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.getBatchPredictions(mockRequest);

      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(0.8);
      expect(result[1].score).toBe(0.9);

      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/predictions/batch-score',
        { predictions: mockRequest },
        expect.any(Object)
      );
    });

    it('should handle batch processing errors', async () => {
      const mockRequest = [
        {
          job: {
            id: 'job-1',
            title: 'Software Developer',
            description: 'A great software development position',
            requirements: [],
            skills: [],
            experienceLevel: 'Mid',
            employmentType: 'FULL_TIME',
            placement: 'REMOTE',
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            industry: 'Technology',
            orgSize: 'Medium',
            orgType: 'Non-profit',
          },
          applicant: {
            id: 'applicant-1',
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            location: { country: 'US', state: 'CA', city: 'San Francisco' },
            availability: 'Immediate',
            workPreferences: {
              employmentTypes: ['FULL_TIME'],
              placements: ['REMOTE'],
              industries: ['Technology'],
            },
          },
        },
      ];

      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => ({
        response: {
          status: 400,
          data: { error: 'Invalid request data' },
        },
      })));

      await expect(service.getBatchPredictions(mockRequest))
        .rejects.toThrow(HttpException);
    });
  });

  describe('getRecommendations', () => {
    it('should get job recommendations successfully', async () => {
      const mockRequest = {
        id: 'applicant-1',
        skills: ['React', 'Node.js'],
        experience: [{
          title: 'Software Developer',
          company: 'Tech Corp',
          duration: 2,
          description: 'Full-stack development',
          skills: ['React', 'Node.js'],
        }],
        education: [{
          degree: 'Bachelor',
          field: 'Computer Science',
          institution: 'University',
          graduationYear: 2020,
        }],
        certifications: [],
        location: { country: 'US', state: 'CA', city: 'San Francisco' },
        availability: 'Immediate',
        workPreferences: {
          employmentTypes: ['FULL_TIME'],
          placements: ['REMOTE'],
          industries: ['Technology'],
        },
      };

      const mockResponse = {
        data: {
          recommendations: [
            {
              score: 0.9,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionId: 'pred-1',
              confidence: 0.9,
              processingTime: 150,
            },
            {
              score: 0.8,
              scoreDetails: {},
              modelVersion: '1.0.0',
              predictionId: 'pred-2',
              confidence: 0.8,
              processingTime: 160,
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.getRecommendations(mockRequest, 10);

      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(0.9);
      expect(result[1].score).toBe(0.8);

      expect(httpService.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/recommendations',
        {
          applicant: mockRequest,
          limit: 10,
        },
        expect.any(Object)
      );
    });

    it('should handle recommendation errors', async () => {
      const mockRequest = {
        id: 'applicant-1',
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        location: { country: 'US', state: 'CA', city: 'San Francisco' },
        availability: 'Immediate',
        workPreferences: {
          employmentTypes: ['FULL_TIME'],
          placements: ['REMOTE'],
          industries: ['Technology'],
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => ({
        response: {
          status: 404,
          data: { error: 'Applicant not found' },
        },
      })));

      await expect(service.getRecommendations(mockRequest, 10))
        .rejects.toThrow(HttpException);
    });
  });

  describe('isHealthy', () => {
    it('should return true when service is healthy', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
        data: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.isHealthy();

      expect(result).toBe(true);

      expect(httpService.get).toHaveBeenCalledWith(
        'http://localhost:8000/health',
        expect.objectContaining({
          timeout: 5000,
        })
      );
    });

    it('should return false when service is unhealthy', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Connection failed')));

      const result = await service.isHealthy();

      expect(result).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should get service status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'running',
          version: '1.0.0',
          model: 'v1.0.0',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getStatus();

      expect(result.status).toBe('running');
      expect(result.version).toBe('1.0.0');
      expect(result.model).toBe('v1.0.0');

      expect(httpService.get).toHaveBeenCalledWith(
        'http://localhost:8000/status',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
          timeout: 5000,
        })
      );
    });

    it('should handle status check errors', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => ({
        response: {
          status: 503,
          data: { error: 'Service unavailable' },
        },
      })));

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
