import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { OtpService } from './otp.service';
import { Otp } from './otp.entity';
import { OtpChannel } from '../../common/enums/otp-channel.enum';
import { User } from '../../users/shared/user.entity';
import { TestUtils, TEST_CONSTANTS } from '../../../test/test-utils';

describe('OtpService', () => {
  let service: OtpService;
  let otpRepository: Repository<Otp>;

  const mockUser = TestUtils.createMockUser();
  const mockOtp: Otp = {
    id: 'otp-1',
    userId: mockUser.id,
    channel: OtpChannel.EMAIL,
    codeHash: 'hashed-code',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    consumedAt: null,
    createdAt: new Date(),
    user: mockUser,
  };

  const mockRepository = TestUtils.createMockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: getRepositoryToken(Otp),
          useFactory: () => mockRepository,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    otpRepository = module.get<Repository<Otp>>(getRepositoryToken(Otp));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOtp', () => {
    it('should generate OTP successfully with user object', async () => {
      const channel = OtpChannel.EMAIL;
      const ttlMinutes = 15;
      const code = '123456';
      const codeHash = 'hashed-code';

      (bcrypt.hash as jest.Mock).mockResolvedValue(codeHash);
      jest.spyOn(otpRepository, 'create').mockReturnValue(mockOtp as any);
      jest.spyOn(otpRepository, 'save').mockResolvedValue(mockOtp as any);

      const result = await service.generateOtp(mockUser, channel, ttlMinutes);

      expect(result).toEqual({
        id: mockOtp.id,
        code: expect.any(String),
      });
      expect(result.code).toHaveLength(6);
      expect(otpRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        channel,
        codeHash: expect.any(String),
        expiresAt: expect.any(Date),
        consumedAt: null,
      });
      expect(otpRepository.save).toHaveBeenCalledWith(mockOtp);
    });

    it('should generate OTP successfully with user ID string', async () => {
      const userId = 'user-123';
      const channel = OtpChannel.SMS;
      const code = '654321';
      const codeHash = 'hashed-code';

      (bcrypt.hash as jest.Mock).mockResolvedValue(codeHash);
      jest.spyOn(otpRepository, 'create').mockReturnValue(mockOtp as any);
      jest.spyOn(otpRepository, 'save').mockResolvedValue(mockOtp as any);

      const result = await service.generateOtp(userId, channel);

      expect(result).toEqual({
        id: mockOtp.id,
        code: expect.any(String),
      });
      expect(otpRepository.create).toHaveBeenCalledWith({
        userId,
        channel,
        codeHash: expect.any(String),
        expiresAt: expect.any(Date),
        consumedAt: null,
      });
    });

    it('should use default TTL of 15 minutes', async () => {
      const channel = OtpChannel.EMAIL;
      const codeHash = 'hashed-code';

      (bcrypt.hash as jest.Mock).mockResolvedValue(codeHash);
      jest.spyOn(otpRepository, 'create').mockReturnValue(mockOtp as any);
      jest.spyOn(otpRepository, 'save').mockResolvedValue(mockOtp as any);

      await service.generateOtp(mockUser, channel);

      const createCall = (otpRepository.create as jest.Mock).mock.calls[0][0];
      const expectedExpiry = new Date(Date.now() + 15 * 60 * 1000);
      expect(createCall.expiresAt.getTime()).toBeCloseTo(expectedExpiry.getTime(), -2);
    });

    it('should use custom TTL when provided', async () => {
      const channel = OtpChannel.EMAIL;
      const ttlMinutes = 30;
      const codeHash = 'hashed-code';

      (bcrypt.hash as jest.Mock).mockResolvedValue(codeHash);
      jest.spyOn(otpRepository, 'create').mockReturnValue(mockOtp as any);
      jest.spyOn(otpRepository, 'save').mockResolvedValue(mockOtp as any);

      await service.generateOtp(mockUser, channel, ttlMinutes);

      const createCall = (otpRepository.create as jest.Mock).mock.calls[0][0];
      const expectedExpiry = new Date(Date.now() + 30 * 60 * 1000);
      expect(createCall.expiresAt.getTime()).toBeCloseTo(expectedExpiry.getTime(), -2);
    });
  });

  describe('validateOtp', () => {
    it('should validate OTP successfully', async () => {
      const userId = mockUser.id;
      const token = '123456';
      const channel = OtpChannel.EMAIL;

      // Mock the repository to return the OTP when findOne is called
      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(mockOtp as any);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateOtp(userId, token, channel);

      expect(result).toEqual(mockOtp);
      expect(bcrypt.compare).toHaveBeenCalledWith(token, mockOtp.codeHash);
    });

    it('should return null if OTP not found', async () => {
      const userId = mockUser.id;
      const token = '123456';
      const channel = OtpChannel.EMAIL;

      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateOtp(userId, token, channel);

      expect(result).toBeNull();
    });

    it('should return null if OTP code does not match', async () => {
      const userId = mockUser.id;
      const token = 'wrong-code';
      const channel = OtpChannel.EMAIL;

      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(mockOtp as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateOtp(userId, token, channel);

      expect(result).toBeNull();
    });

    it('should validate OTP without channel filter', async () => {
      const userId = mockUser.id;
      const token = '123456';

      // Mock the repository to return the OTP when findOne is called
      jest.spyOn(otpRepository, 'findOne').mockResolvedValue(mockOtp as any);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateOtp(userId, token);

      expect(result).toEqual(mockOtp);
      expect(bcrypt.compare).toHaveBeenCalledWith(token, mockOtp.codeHash);
    });
  });

  describe('consumeOtp', () => {
    it('should consume OTP successfully', async () => {
      const otpId = 'otp-1';

      jest.spyOn(otpRepository, 'update').mockResolvedValue({ affected: 1 } as any);

      await service.consumeOtp(otpId);

      expect(otpRepository.update).toHaveBeenCalledWith(
        { id: otpId },
        { consumedAt: expect.any(Date) }
      );
    });

    it('should handle update failure gracefully', async () => {
      const otpId = 'nonexistent-otp';

      jest.spyOn(otpRepository, 'update').mockResolvedValue({ affected: 0 } as any);

      await expect(service.consumeOtp(otpId)).resolves.toBeUndefined();
    });
  });

  describe('generateNumericCode', () => {
    it('should generate 6-digit code by default', () => {
      const code = (service as any).generateNumericCode();
      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    });

    it('should generate code with specified length', () => {
      const code = (service as any).generateNumericCode(4);
      expect(code).toHaveLength(4);
      expect(/^\d{4}$/.test(code)).toBe(true);
    });

    it('should pad with zeros if needed', () => {
      // Mock Math.random to return a small number
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.001);

      const code = (service as any).generateNumericCode(6);
      expect(code).toHaveLength(6);
      expect(code.startsWith('0')).toBe(true);

      Math.random = originalRandom;
    });
  });
});
