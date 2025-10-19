import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { User } from '../users/shared/user.entity';
import { UsersService } from '../users/shared/user.service';
import { OtpService } from './otp/otp.service';
import { EmailService } from '../notifications/email.service';
import { Role } from '../common/enums/role.enum';
import { OtpChannel } from '../common/enums/otp-channel.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let otpService: OtpService;
  let emailService: EmailService;
  let jwtService: JwtService;

  const mockUser: User = {
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
  };

  const mockUsersService = {
    findByEmailWithPassword: jest.fn(),
    findOneById: jest.fn(),
    findOneByIdWithProfile: jest.fn(),
    findByEmailVerificationToken: jest.fn(),
    markEmailAsVerified: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockOtpService = {
    generateOtp: jest.fn(),
    verifyOtp: jest.fn(),
    validateOtp: jest.fn(),
    consumeOtp: jest.fn(),
  };

  const mockEmailService = {
    sendFromTemplate: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: OtpService,
          useValue: mockOtpService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    otpService = module.get<OtpService>(OtpService);
    emailService = module.get<EmailService>(EmailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const user = mockUser;
      const accessToken = 'access-token';

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(user);

      expect(result).toEqual({
        accessToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should validate user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed-password';

      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        ...mockUser,
        passwordHash: hashedPassword,
      });

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
        isVerified: mockUser.isVerified,
        emailVerificationToken: mockUser.emailVerificationToken,
        lastLoginAt: mockUser.lastLoginAt,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        applicantProfile: mockUser.applicantProfile,
        nonprofitOrg: mockUser.nonprofitOrg,
      });
      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      const role = Role.APPLICANT;

      const hashedPassword = 'hashed-password';
      const createdUser = {
        ...mockUser,
        email,
        passwordHash: hashedPassword,
        role,
      };

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);

      // Mock bcrypt.hash
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const result = await service.register(email, password, role);

      expect(result).toEqual(createdUser);
      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email,
        passwordHash: hashedPassword,
        role,
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const email = 'existing@example.com';
      const password = 'password123';
      const role = Role.APPLICANT;

      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);

      await expect(service.register(email, password, role)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully with valid token', async () => {
      const token = 'valid-user-id';

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockUsersService.markEmailAsVerified.mockResolvedValue(undefined);

      const result = await service.verifyEmail(token);

      expect(result).toEqual({ message: 'Email verified successfully' });
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(token);
      expect(mockUsersService.markEmailAsVerified).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid-token';

      mockUsersService.findOneById.mockResolvedValue(null);

      await expect(service.verifyEmail(token)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      mockOtpService.generateOtp.mockResolvedValue({
        code: '123456',
        expiresAt: new Date(),
      });
      mockEmailService.sendFromTemplate.mockResolvedValue(undefined);

      const result = await service.resendVerificationEmail(email);

      expect(result).toEqual({ message: 'Verification email sent successfully' });
      expect(mockOtpService.generateOtp).toHaveBeenCalledWith(mockUser.id, OtpChannel.EMAIL);
      expect(mockEmailService.sendFromTemplate).toHaveBeenCalledWith(
        email,
        'Verify Your Email',
        'email-verification',
        { code: '123456', name: email },
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.resendVerificationEmail(email)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email already verified', async () => {
      const email = 'test@example.com';
      const verifiedUser = { ...mockUser, isVerified: true };

      mockUsersService.findByEmailWithPassword.mockResolvedValue(verifiedUser);

      await expect(service.resendVerificationEmail(email)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const newAccessToken = 'new-access-token';
      const payload = { sub: mockUser.id, email: mockUser.email, role: mockUser.role };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOneByIdWithProfile.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({ accessToken: newAccessToken });
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(mockUsersService.findOneByIdWithProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'nonexistent-user', email: 'test@example.com', role: Role.APPLICANT };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOneByIdWithProfile.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await service.logout();

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const email = 'test@example.com';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      mockOtpService.generateOtp.mockResolvedValue({
        code: '123456',
        expiresAt: new Date(),
      });
      mockEmailService.sendFromTemplate.mockResolvedValue(undefined);

      await service.requestPasswordReset(email);

      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
      expect(mockOtpService.generateOtp).toHaveBeenCalledWith(mockUser.id, OtpChannel.EMAIL);
      expect(mockEmailService.sendFromTemplate).toHaveBeenCalledWith(
        email,
        'Your Password Reset Code',
        'password-reset',
        { code: '123456', name: email },
      );
    });

    it('should not throw error if user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.requestPasswordReset(email)).resolves.toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const email = 'test@example.com';
      const token = 'valid-token';
      const newPassword = 'newpassword123';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      mockOtpService.validateOtp.mockResolvedValue({ id: 'otp-id' });
      mockUsersService.updatePassword.mockResolvedValue(undefined);
      mockOtpService.consumeOtp.mockResolvedValue(undefined);

      // Mock bcrypt.hash
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new-hashed-password');

      await service.resetPassword(email, token, newPassword);

      expect(mockUsersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
      expect(mockOtpService.validateOtp).toHaveBeenCalledWith(mockUser.id, token, OtpChannel.EMAIL);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(mockUser.id, 'new-hashed-password');
      expect(mockOtpService.consumeOtp).toHaveBeenCalledWith('otp-id');
    });

    it('should throw BadRequestException if user not found', async () => {
      const email = 'nonexistent@example.com';
      const token = 'valid-token';
      const newPassword = 'newpassword123';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.resetPassword(email, token, newPassword)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if invalid token', async () => {
      const email = 'test@example.com';
      const token = 'invalid-token';
      const newPassword = 'newpassword123';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(mockUser);
      mockOtpService.validateOtp.mockResolvedValue(null);

      await expect(service.resetPassword(email, token, newPassword)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyUserFromToken', () => {
    it('should verify user from token successfully', async () => {
      const token = 'valid-token';
      const payload = { sub: mockUser.id, email: mockUser.email, role: mockUser.role };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOneByIdWithProfile.mockResolvedValue(mockUser);

      const result = await service.verifyUserFromToken(token);

      expect(result).toEqual(mockUser);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findOneByIdWithProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const token = 'valid-token';
      const payload = { sub: 'nonexistent-user', email: 'test@example.com', role: Role.APPLICANT };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOneByIdWithProfile.mockResolvedValue(null);

      await expect(service.verifyUserFromToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });
});
