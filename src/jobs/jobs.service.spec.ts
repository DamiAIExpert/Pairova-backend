import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { JobStatus, EmploymentType, JobPlacement } from '../common/enums/job.enum';

describe('JobsService', () => {
  let service: JobsService;
  let jobRepository: Repository<Job>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    role: Role.NONPROFIT,
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
    orgUserId: 'user-1',
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
    status: JobStatus.DRAFT,
    createdBy: 'user-1',
    creator: null,
    postedById: 'user-1',
    postedBy: null,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null,
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
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getMany: jest.fn(),
    })),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job successfully', async () => {
      const createJobDto = {
        title: 'Software Developer',
        description: 'A great software development position',
        placement: JobPlacement.REMOTE,
        employmentType: EmploymentType.FULL_TIME,
      };

      const createdJob = { ...mockJob, ...createJobDto };

      jest.spyOn(jobRepository, 'create').mockReturnValue(createdJob as any);
      jest.spyOn(jobRepository, 'save').mockResolvedValue(createdJob as any);

      const result = await service.create(createJobDto, mockUser);

      expect(result).toEqual(createdJob);
      expect(jobRepository.create).toHaveBeenCalledWith({
        ...createJobDto,
        orgUserId: mockUser.id,
        createdBy: mockUser.id,
        status: JobStatus.DRAFT,
      });
      expect(jobRepository.save).toHaveBeenCalledWith(createdJob);
    });
  });

  describe('findAllPublished', () => {
    it('should return all published jobs', async () => {
      const mockJobs = [mockJob];
      jest.spyOn(jobRepository, 'find').mockResolvedValue(mockJobs as any);

      const result = await service.findAllPublished();

      expect(result).toEqual(mockJobs);
      expect(jobRepository.find).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        relations: ['organization'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(mockJob as any);

      const result = await service.findOne('job-1');

      expect(result).toEqual(mockJob);
      expect(jobRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        relations: ['organization', 'applications'],
      });
    });

    it('should throw NotFoundException if job not found', async () => {
      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('nonexistent-job')).rejects.toThrow(NotFoundException);
    });
  });


  describe('publish', () => {
    it('should publish a job successfully', async () => {
      const draftJob = { ...mockJob, status: JobStatus.DRAFT };
      const publishedJob = { ...mockJob, status: JobStatus.PUBLISHED };

      jest.spyOn(service, 'findOne').mockResolvedValue(draftJob as any);
      jest.spyOn(jobRepository, 'save').mockResolvedValue(publishedJob as any);

      const result = await service.publish('job-1', mockUser);

      expect(result).toEqual(publishedJob);
      expect(jobRepository.save).toHaveBeenCalledWith(publishedJob);
    });

    it('should throw ForbiddenException if job is already published', async () => {
      const publishedJob = { ...mockJob, status: JobStatus.PUBLISHED };

      jest.spyOn(service, 'findOne').mockResolvedValue(publishedJob as any);

      await expect(service.publish('job-1', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is not the job owner', async () => {
      const otherUser = { ...mockUser, id: 'other-user', nonprofitProfile: null };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockJob as any);

      await expect(service.publish('job-1', otherUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('close', () => {
    it('should close a job successfully', async () => {
      const publishedJob = { ...mockJob, status: JobStatus.PUBLISHED };
      const closedJob = { ...mockJob, status: JobStatus.CLOSED };

      jest.spyOn(service, 'findOne').mockResolvedValue(publishedJob as any);
      jest.spyOn(jobRepository, 'save').mockResolvedValue(closedJob as any);

      const result = await service.close('job-1', mockUser);

      expect(result).toEqual(closedJob);
      expect(jobRepository.save).toHaveBeenCalledWith(closedJob);
    });

    it('should throw ForbiddenException if job is already closed', async () => {
      const closedJob = { ...mockJob, status: JobStatus.CLOSED };

      jest.spyOn(service, 'findOne').mockResolvedValue(closedJob as any);

      await expect(service.close('job-1', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is not the job owner', async () => {
      const otherUser = { ...mockUser, id: 'other-user', nonprofitProfile: null };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockJob as any);

      await expect(service.close('job-1', otherUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getFeaturedJobs', () => {
    it('should return featured jobs', async () => {
      const featuredJobs = [mockJob];
      jest.spyOn(jobRepository, 'find').mockResolvedValue(featuredJobs as any);

      const result = await service.getFeaturedJobs(5);

      expect(result).toEqual(featuredJobs);
      expect(jobRepository.find).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        relations: ['organization'],
        order: { createdAt: 'DESC' },
        take: 5,
      });
    });

    it('should use default limit of 10', async () => {
      jest.spyOn(jobRepository, 'find').mockResolvedValue([]);

      await service.getFeaturedJobs();

      expect(jobRepository.find).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        relations: ['organization'],
        order: { createdAt: 'DESC' },
        take: 10,
      });
    });
  });

});
