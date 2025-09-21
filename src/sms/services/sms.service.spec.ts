import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SmsService } from './sms.service';
import { SmsProviderFactoryService } from './sms-provider-factory.service';
import { SmsProvider, SmsProviderType } from '../entities/sms-provider.entity';
import { SmsLog, SmsLogStatus } from '../entities/sms-log.entity';

describe('SmsService', () => {
  let service: SmsService;
  let smsProviderRepository: Repository<SmsProvider>;
  let smsLogRepository: Repository<SmsLog>;
  let smsProviderFactoryService: SmsProviderFactoryService;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  });

  const mockSmsProvider: SmsProvider = {
    id: 'provider-1',
    providerType: SmsProviderType.TWILIO,
    name: 'Twilio Provider',
    configuration: {
      accountSid: 'test-sid',
      authToken: 'test-token',
      fromNumber: '+1234567890',
    },
    priority: 1,
    isActive: true,
    lastHealthCheckAt: new Date(),
    lastHealthCheckStatus: true,
    healthCheckError: null,
    supportedCountries: ['US', 'CA'],
    supportedFeatures: ['SMS', 'VOICE'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSmsProviderFactory = {
    createProvider: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: getRepositoryToken(SmsProvider),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(SmsLog),
          useFactory: mockRepository,
        },
        {
          provide: SmsProviderFactoryService,
          useValue: mockSmsProviderFactory,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    smsProviderRepository = module.get<Repository<SmsProvider>>(getRepositoryToken(SmsProvider));
    smsLogRepository = module.get<Repository<SmsLog>>(getRepositoryToken(SmsLog));
    smsProviderFactoryService = module.get<SmsProviderFactoryService>(SmsProviderFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSms', () => {
    it('should send SMS successfully with active provider', async () => {
      const recipient = '+1234567890';
      const message = 'Test message';
      const mockProvider = {
        sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'msg-123' }),
      };

      jest.spyOn(service, 'getActiveProvider').mockResolvedValue(mockSmsProvider);
      jest.spyOn(smsProviderFactoryService, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      const result = await service.sendSms(recipient, message);

      expect(result.success).toBe(true);
      expect(result.providerId).toBe('provider-1');
      expect(mockProvider.sendSms).toHaveBeenCalledWith(recipient, message);
      expect(smsLogRepository.save).toHaveBeenCalled();
    });

    it('should try next provider when first fails', async () => {
      const recipient = '+1234567890';
      const message = 'Test message';
      const mockProvider1 = {
        sendSms: jest.fn().mockRejectedValue(new Error('Provider 1 failed')),
      };
      const mockProvider2 = {
        sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'msg-456' }),
      };

      const providers = [
        { ...mockSmsProvider, id: 'provider-1', priority: 1 },
        { ...mockSmsProvider, id: 'provider-2', priority: 2 },
      ];

      jest.spyOn(service, 'getActiveProviders').mockResolvedValue(providers);
      jest.spyOn(smsProviderFactoryService, 'createProvider')
        .mockReturnValueOnce(mockProvider1)
        .mockReturnValueOnce(mockProvider2);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      const result = await service.sendSms(recipient, message);

      expect(result.success).toBe(true);
      expect(result.providerId).toBe('provider-2');
      expect(mockProvider1.sendSms).toHaveBeenCalled();
      expect(mockProvider2.sendSms).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no active providers', async () => {
      const recipient = '+1234567890';
      const message = 'Test message';

      jest.spyOn(service, 'getActiveProviders').mockResolvedValue([]);

      await expect(service.sendSms(recipient, message))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when all providers fail', async () => {
      const recipient = '+1234567890';
      const message = 'Test message';
      const mockProvider = {
        sendSms: jest.fn().mockRejectedValue(new Error('All providers failed')),
      };

      jest.spyOn(service, 'getActiveProviders').mockResolvedValue([mockSmsProvider]);
      jest.spyOn(smsProviderFactoryService, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      await expect(service.sendSms(recipient, message))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getActiveProviders', () => {
    it('should return active providers ordered by priority', async () => {
      const providers = [
        { ...mockSmsProvider, id: 'provider-1', priority: 2 },
        { ...mockSmsProvider, id: 'provider-2', priority: 1 },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(providers),
      };

      jest.spyOn(smsProviderRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getActiveProviders();

      expect(result).toHaveLength(2);
      expect(result[0].priority).toBe(1); // Should be sorted by priority
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('isActive = :isActive', { isActive: true });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('priority', 'ASC');
    });

    it('should return empty array when no active providers', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(smsProviderRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getActiveProviders();

      expect(result).toHaveLength(0);
    });
  });

  describe('performHealthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockProvider = {
        healthCheck: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(smsProviderFactoryService, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsProviderRepository, 'update').mockResolvedValue({} as any);

      await service.performHealthCheck('provider-1');

      expect(mockProvider.healthCheck).toHaveBeenCalled();
      expect(smsProviderRepository.update).toHaveBeenCalledWith('provider-1', {
        lastHealthCheckAt: expect.any(Date),
        lastHealthCheckStatus: true,
        healthCheckError: null,
      });
    });

    it('should handle health check failure', async () => {
      const mockProvider = {
        healthCheck: jest.fn().mockRejectedValue(new Error('Health check failed')),
      };

      jest.spyOn(smsProviderFactoryService, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsProviderRepository, 'update').mockResolvedValue({} as any);

      await service.performHealthCheck('provider-1');

      expect(mockProvider.healthCheck).toHaveBeenCalled();
      expect(smsProviderRepository.update).toHaveBeenCalledWith('provider-1', {
        lastHealthCheckAt: expect.any(Date),
        lastHealthCheckStatus: false,
        healthCheckError: 'Health check failed',
      });
    });
  });

  describe('getSmsStatistics', () => {
    it('should return SMS statistics', async () => {
      const mockLogs = [
        { status: SmsLogStatus.SENT, cost: 0.05 },
        { status: SmsLogStatus.DELIVERED, cost: 0.05 },
        { status: SmsLogStatus.FAILED, cost: 0 },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockLogs),
      };

      jest.spyOn(smsLogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getSmsStatistics();

      expect(result).toEqual({
        totalSent: 3,
        totalDelivered: 1,
        totalFailed: 1,
        totalCost: 0.1,
        successRate: 66.67,
      });
    });

    it('should handle empty logs', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(smsLogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getSmsStatistics();

      expect(result).toEqual({
        totalSent: 0,
        totalDelivered: 0,
        totalFailed: 0,
        totalCost: 0,
        successRate: 0,
      });
    });
  });

  describe('getSmsLogs', () => {
    it('should return SMS logs with pagination', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          recipient: '+1234567890',
          message: 'Test message',
          status: SmsLogStatus.SENT,
          sentAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLogs, 1]),
      };

      jest.spyOn(smsLogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getSmsLogs({ page: 1, limit: 20 });

      expect(result.logs).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should filter logs by status', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest.spyOn(smsLogRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      await service.getSmsLogs({ 
        status: SmsLogStatus.FAILED,
        page: 1, 
        limit: 20 
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'smsLog.status = :status', 
        { status: SmsLogStatus.FAILED }
      );
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate US phone number', () => {
      expect(service.validatePhoneNumber('+1234567890')).toBe(true);
      expect(service.validatePhoneNumber('1234567890')).toBe(true);
    });

    it('should validate international phone number', () => {
      expect(service.validatePhoneNumber('+447911123456')).toBe(true);
      expect(service.validatePhoneNumber('+8613812345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(service.validatePhoneNumber('123')).toBe(false);
      expect(service.validatePhoneNumber('invalid')).toBe(false);
      expect(service.validatePhoneNumber('')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone number with country code', () => {
      expect(service.formatPhoneNumber('1234567890', 'US')).toBe('+1234567890');
      expect(service.formatPhoneNumber('7911123456', 'GB')).toBe('+447911123456');
    });

    it('should return number as-is if already formatted', () => {
      expect(service.formatPhoneNumber('+1234567890', 'US')).toBe('+1234567890');
    });
  });
});
