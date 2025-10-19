import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

import { ApplicationsService } from './application.service';
import { Application } from '../entities/application.entity';
import { Job } from '../entities/job.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicationStatus, EmploymentType, JobPlacement, JobStatus } from '../../common/enums/job.enum';
import { Role } from '../../common/enums/role.enum';
import { JobsService } from '../jobs.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationRepository: Repository<Application>;
  let jobRepository: Repository<Job>;
  let jobsService: JobsService;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    role: Role.APPLICANT,
    passwordHash: 'hashed-password',
    phone: '+1234567890',
    isVerified: true,
    emailVerificationToken: null,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    applicantProfile: null,
    nonprofitOrg: null,
    nonprofitProfile: null,
  };

  const mockJob: Job = {
    id: 'job-1',
    orgUserId: 'user-2',
    organization: null,
    title: 'Software Developer',
    description: 'A great software development position',
    placement: JobPlacement.REMOTE,
    employmentType: EmploymentType.FULL_TIME,
    experienceMinYrs: 2,
    experienceMaxYrs: 5,
    experienceLevel: 'MID',
    requiredSkills: ['React', 'Node.js'],
    benefits: ['Health insurance'],
    deadline: new Date(),
    locationCity: 'Remote',
    locationState: null,
    locationCountry: 'US',
    salaryMin: 50000,
    salaryMax: 80000,
    currency: 'USD',
    status: JobStatus.PUBLISHED,
    createdBy: 'user-2',
    creator: null,
    postedById: 'user-2',
    postedBy: null,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };

  const mockApplication: Application = {
    id: 'app-1',
    jobId: 'job-1',
    applicantId: 'user-1',
    status: ApplicationStatus.PENDING,
    coverLetter: 'I am interested in this position',
    resumeUploadId: null,
    resumeUrl: null,
    matchScore: null,
    notes: null,
    appliedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    job: mockJob,
    applicant: mockUser,
    resume: null,
  };

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Job),
          useFactory: mockRepository,
        },
        {
          provide: JobsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
    jobsService = module.get<JobsService>(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('apply', () => {
    it('should create a new application successfully', async () => {
      const createApplicationDto = {
        jobId: 'job-1',
        coverLetter: 'I am interested in this position',
        resumeUrl: 'https://example.com/resume.pdf',
      };

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(jobsService, 'findOne').mockResolvedValue(mockJob as any);
      jest.spyOn(applicationRepository, 'create').mockReturnValue(mockApplication as any);
      jest.spyOn(applicationRepository, 'save').mockResolvedValue(mockApplication as any);

      const result = await service.apply(createApplicationDto, mockUser);

      expect(result).toEqual(mockApplication);
      expect(applicationRepository.create).toHaveBeenCalledWith({
        ...createApplicationDto,
        applicantId: mockUser.id,
        status: ApplicationStatus.PENDING,
        appliedAt: expect.any(Date),
      });
      expect(applicationRepository.save).toHaveBeenCalledWith(mockApplication);
    });

    it('should throw ConflictException if user has already applied', async () => {
      const createApplicationDto = {
        jobId: 'job-1',
        coverLetter: 'I am interested in this position',
      };

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(mockApplication as any);

      await expect(service.apply(createApplicationDto, mockUser)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if job does not exist', async () => {
      const createApplicationDto = {
        jobId: 'nonexistent-job',
        coverLetter: 'I am interested in this position',
      };

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(jobsService, 'findOne').mockRejectedValue(new NotFoundException('Job not found'));

      await expect(service.apply(createApplicationDto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });


  describe('findOne', () => {
    it('should return an application by id', async () => {
      const applicationId = 'app-1';

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(mockApplication as any);

      const result = await service.findOne(applicationId, mockUser);

      expect(result).toEqual(mockApplication);
      expect(applicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: applicationId },
        relations: ['job', 'applicant', 'applicant.applicantProfile']
      });
    });

    it('should throw NotFoundException if application not found', async () => {
      const applicationId = 'nonexistent-app';

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(applicationId, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllForUser', () => {
    it('should return all applications for a specific user', async () => {
      const mockApplications = [mockApplication];

      jest.spyOn(applicationRepository, 'find').mockResolvedValue(mockApplications as any);

      const result = await service.findAllForUser(mockUser);

      expect(result).toEqual(mockApplications);
      expect(applicationRepository.find).toHaveBeenCalledWith({
        where: { applicantId: mockUser.id },
        relations: ['job', 'job.organization'],
      });
    });
  });

  describe('updateStatus', () => {
    it('should update application status successfully', async () => {
      const applicationId = 'app-1';
      const status = ApplicationStatus.REVIEWED;
      const notes = 'Moved to next stage';
      const adminUser = { ...mockUser, role: Role.ADMIN, nonprofitProfile: null };

      const updatedApplication = { ...mockApplication, status, notes };

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(mockApplication as any);
      jest.spyOn(applicationRepository, 'save').mockResolvedValue(updatedApplication as any);

      const result = await service.updateStatus(applicationId, status, notes, adminUser);

      expect(result).toEqual(updatedApplication);
      expect(applicationRepository.save).toHaveBeenCalledWith({
        ...mockApplication,
        status,
        notes,
      });
    });

    it('should throw NotFoundException if application not found', async () => {
      const applicationId = 'nonexistent-app';
      const status = ApplicationStatus.REVIEWED;
      const notes = 'Moved to next stage';
      const adminUser = { ...mockUser, role: Role.ADMIN, nonprofitProfile: null };

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatus(applicationId, status, notes, adminUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const applicationId = 'app-1';
      const status = ApplicationStatus.REVIEWED;
      const notes = 'Moved to next stage';

      jest.spyOn(applicationRepository, 'findOne').mockResolvedValue(mockApplication as any);

      await expect(service.updateStatus(applicationId, status, notes, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove an application successfully', async () => {
      const applicationId = 'app-1';

      jest.spyOn(applicationRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(applicationId);

      expect(applicationRepository.delete).toHaveBeenCalledWith(applicationId);
    });

    it('should throw NotFoundException if application not found', async () => {
      const applicationId = 'nonexistent-app';

      jest.spyOn(applicationRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(applicationId)).rejects.toThrow(NotFoundException);
    });
  });

});
