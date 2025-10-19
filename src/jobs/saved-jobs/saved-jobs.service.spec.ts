import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { SavedJobsService } from './saved-jobs.service';
import { SavedJob } from '../entities/saved-job.entity';
import { Job } from '../entities/job.entity';
import { EmploymentType, JobPlacement, JobStatus } from '../../common/enums/job.enum';

describe('SavedJobsService', () => {
  let service: SavedJobsService;
  let savedJobsRepository: Repository<SavedJob>;
  let jobRepository: Repository<Job>;

  const mockSavedJob: SavedJob = {
    id: 'saved-job-1',
    userId: 'user-1',
    jobId: 'job-1',
    createdAt: new Date(),
    user: null,
    job: null,
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
    status: JobStatus.PUBLISHED,
    createdBy: 'user-1',
    creator: null,
    postedById: 'user-1',
    postedBy: null,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
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
        SavedJobsService,
        {
          provide: getRepositoryToken(SavedJob),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Job),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SavedJobsService>(SavedJobsService);
    savedJobsRepository = module.get<Repository<SavedJob>>(getRepositoryToken(SavedJob));
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveJob', () => {
    it('should save a job successfully', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(mockJob as any);
      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(savedJobsRepository, 'create').mockReturnValue(mockSavedJob as any);
      jest.spyOn(savedJobsRepository, 'save').mockResolvedValue(mockSavedJob as any);

      const result = await service.saveJob(userId, jobId);

      expect(result).toEqual(mockSavedJob);
      expect(savedJobsRepository.create).toHaveBeenCalledWith({
        userId,
        jobId,
      });
      expect(savedJobsRepository.save).toHaveBeenCalledWith(mockSavedJob);
    });

    it('should throw ConflictException if job is already saved', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(mockJob as any);
      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(mockSavedJob as any);

      await expect(service.saveJob(userId, jobId)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if job does not exist', async () => {
      const userId = 'user-1';
      const jobId = 'nonexistent-job';

      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(null);

      await expect(service.saveJob(userId, jobId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsaveJob', () => {
    it('should unsave a job successfully', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(mockSavedJob as any);
      jest.spyOn(savedJobsRepository, 'remove').mockResolvedValue(mockSavedJob as any);

      await service.unsaveJob(userId, jobId);

      expect(savedJobsRepository.findOne).toHaveBeenCalledWith({
        where: { userId, jobId },
      });
      expect(savedJobsRepository.remove).toHaveBeenCalledWith(mockSavedJob);
    });

    it('should throw NotFoundException if saved job not found', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.unsaveJob(userId, jobId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSavedJobs', () => {
    it('should return saved jobs with pagination', async () => {
      const userId = 'user-1';
      const page = 1;
      const limit = 10;
      const mockSavedJobs = [{ ...mockSavedJob, job: mockJob }];
      const total = 1;

      jest.spyOn(savedJobsRepository, 'findAndCount').mockResolvedValue([mockSavedJobs, total]);

      const result = await service.getSavedJobs(userId, page, limit);

      expect(result).toEqual({
        jobs: [mockJob],
        total,
        page,
        limit,
      });
      expect(savedJobsRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId },
        relations: ['job', 'job.organization'],
        skip: 0,
        take: limit,
        order: { createdAt: 'DESC' },
      });
    });

    it('should use default pagination values', async () => {
      const userId = 'user-1';

      jest.spyOn(savedJobsRepository, 'findAndCount').mockResolvedValue([[], 0]);

      await service.getSavedJobs(userId);

      expect(savedJobsRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId },
        relations: ['job', 'job.organization'],
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('isJobSaved', () => {
    it('should return true if job is saved', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(mockSavedJob as any);

      const result = await service.isJobSaved(userId, jobId);

      expect(result).toBe(true);
      expect(savedJobsRepository.findOne).toHaveBeenCalledWith({
        where: { userId, jobId },
      });
    });

    it('should return false if job is not saved', async () => {
      const userId = 'user-1';
      const jobId = 'job-1';

      jest.spyOn(savedJobsRepository, 'findOne').mockResolvedValue(null);

      const result = await service.isJobSaved(userId, jobId);

      expect(result).toBe(false);
    });
  });
});
