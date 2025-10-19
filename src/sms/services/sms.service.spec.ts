import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SmsService } from './sms.service';
import { SmsProviderFactory } from './sms-provider-factory.service';
import { SmsProvider, SmsProviderType, SmsProviderStatus } from '../entities/sms-provider.entity';
import { SmsLog, SmsStatus } from '../entities/sms-log.entity';

describe('SmsService', () => {
  let service: SmsService;
  let smsProviderRepository: Repository<SmsProvider>;
  let smsLogRepository: Repository<SmsLog>;
  let smsProviderFactory: SmsProviderFactory;

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
    status: SmsProviderStatus.ACTIVE,
    description: 'Test Twilio provider',
    configuration: {
      accountSid: 'test-sid',
      authToken: 'test-token',
      fromNumber: '+1234567890',
    },
    isActive: true,
    priority: 1,
    isEnabled: true,
    costPerSms: 0.01,
    currency: 'USD',
    supportedCountries: ['US', 'CA'],
    supportedFeatures: ['SMS', 'VOICE'],
    lastHealthCheck: new Date(),
    isHealthy: true,
    totalSent: 0,
    totalDelivered: 0,
    deliveryRate: 0,
    totalErrors: 0,
    lastError: null,
    lastUsed: null,
    metadata: null,
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
          provide: SmsProviderFactory,
          useValue: mockSmsProviderFactory,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    smsProviderRepository = module.get<Repository<SmsProvider>>(getRepositoryToken(SmsProvider));
    smsLogRepository = module.get<Repository<SmsLog>>(getRepositoryToken(SmsLog));
    smsProviderFactory = module.get<SmsProviderFactory>(SmsProviderFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSms', () => {
    it('should send SMS successfully with active provider', async () => {
      const sendSmsDto = {
        recipient: '+1234567890',
        message: 'Test message',
      };
      const mockProvider = {
        sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'msg-123' }),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockResolvedValue({ isHealthy: true }),
      };

      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue([mockSmsProvider]);
      jest.spyOn(smsProviderFactory, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      const result = await service.sendSms(sendSmsDto);

      expect(result).toBeDefined();
      expect(mockProvider.sendSms).toHaveBeenCalledWith(sendSmsDto.recipient, sendSmsDto.message, expect.any(Object));
      expect(smsLogRepository.save).toHaveBeenCalled();
    });

    it('should try next provider when first fails', async () => {
      const sendSmsDto = {
        recipient: '+1234567890',
        message: 'Test message',
      };
      const mockProvider1 = {
        sendSms: jest.fn().mockRejectedValue(new Error('Provider 1 failed')),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockResolvedValue({ isHealthy: true }),
      };
      const mockProvider2 = {
        sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'msg-456' }),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockResolvedValue({ isHealthy: true }),
      };

      const providers = [
        { ...mockSmsProvider, id: 'provider-1', priority: 1 },
        { ...mockSmsProvider, id: 'provider-2', priority: 2 },
      ];

      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue(providers);
      jest.spyOn(smsProviderFactory, 'createProvider')
        .mockReturnValueOnce(mockProvider1)
        .mockReturnValueOnce(mockProvider2);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      const result = await service.sendSms(sendSmsDto);

      expect(result).toBeDefined();
      expect(mockProvider1.sendSms).toHaveBeenCalled();
      expect(mockProvider2.sendSms).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no active providers', async () => {
      const sendSmsDto = {
        recipient: '+1234567890',
        message: 'Test message',
      };

      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue([]);

      await expect(service.sendSms(sendSmsDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when all providers fail', async () => {
      const sendSmsDto = {
        recipient: '+1234567890',
        message: 'Test message',
      };
      const mockProvider = {
        sendSms: jest.fn().mockRejectedValue(new Error('All providers failed')),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockResolvedValue({ isHealthy: true }),
      };

      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue([mockSmsProvider]);
      jest.spyOn(smsProviderFactory, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsLogRepository, 'create').mockReturnValue({} as SmsLog);
      jest.spyOn(smsLogRepository, 'save').mockResolvedValue({} as SmsLog);

      await expect(service.sendSms(sendSmsDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getProviders', () => {
    it('should return all providers', async () => {
      const providers = [
        { ...mockSmsProvider, id: 'provider-1', priority: 2 },
        { ...mockSmsProvider, id: 'provider-2', priority: 1 },
      ];

      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue(providers);

      const result = await service.getProviders();

      expect(result).toHaveLength(2);
      expect(smsProviderRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no providers', async () => {
      jest.spyOn(smsProviderRepository, 'find').mockResolvedValue([]);

      const result = await service.getProviders();

      expect(result).toHaveLength(0);
    });
  });

  describe('performHealthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockProvider = {
        sendSms: jest.fn(),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockResolvedValue({ isHealthy: true }),
      };

      jest.spyOn(smsProviderRepository, 'findOne').mockResolvedValue(mockSmsProvider);
      jest.spyOn(smsProviderFactory, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsProviderRepository, 'update').mockResolvedValue({} as any);

      await service.performHealthCheck('provider-1');

      expect(mockProvider.getHealthStatus).toHaveBeenCalled();
      expect(smsProviderRepository.update).toHaveBeenCalledWith('provider-1', {
        lastHealthCheck: expect.any(Date),
        isHealthy: true,
      });
    });

    it('should handle health check failure', async () => {
      const mockProvider = {
        sendSms: jest.fn(),
        validateConfiguration: jest.fn().mockResolvedValue(true),
        getHealthStatus: jest.fn().mockRejectedValue(new Error('Health check failed')),
      };

      jest.spyOn(smsProviderRepository, 'findOne').mockResolvedValue(mockSmsProvider);
      jest.spyOn(smsProviderFactory, 'createProvider').mockReturnValue(mockProvider);
      jest.spyOn(smsProviderRepository, 'update').mockResolvedValue({} as any);

      await service.performHealthCheck('provider-1');

      expect(mockProvider.getHealthStatus).toHaveBeenCalled();
      expect(smsProviderRepository.update).toHaveBeenCalledWith('provider-1', {
        lastHealthCheck: expect.any(Date),
        isHealthy: false,
      });
    });
  });

  describe('getSmsStatistics', () => {
    it('should return SMS statistics', async () => {
      const mockLogs = [
        { status: SmsStatus.SENT, cost: 0.05 },
        { status: SmsStatus.DELIVERED, cost: 0.05 },
        { status: SmsStatus.FAILED, cost: 0 },
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
        deliveryRate: 66.67,
        providerStats: expect.any(Array),
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
        deliveryRate: 0,
        providerStats: expect.any(Array),
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
          status: SmsStatus.SENT,
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

      const result = await service.getSmsLogs(1, 20);

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

      await service.getSmsLogs(1, 20, { status: SmsStatus.FAILED });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'smsLog.status = :status', 
        { status: SmsStatus.FAILED }
      );
    });
  });

});
