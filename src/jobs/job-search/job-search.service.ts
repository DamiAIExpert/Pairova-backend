// src/jobs/job-search/job-search.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Job } from '../entities/job.entity';
import { Application } from '../entities/application.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { SavedJobsService } from '../saved-jobs/saved-jobs.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  JobSearchDto, 
  JobSearchFiltersDto, 
  JobSearchResultDto, 
  SearchFiltersDto,
  NearbyJobsDto 
} from './dto/job-search.dto';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { JobPlacement } from '../../common/enums/job.enum';
import { JobStatus } from '../entities/job.entity';
import { Role } from '../../common/enums/role.enum';

/**
 * @class JobSearchService
 * @description Provides business logic for job search and discovery operations.
 */
@Injectable()
export class JobSearchService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantRepository: Repository<ApplicantProfile>,
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
    private readonly savedJobsService: SavedJobsService,
  ) {}

  /**
   * Search jobs with advanced filtering and pagination
   */
  async searchJobs(
    paginationDto: PaginationDto,
    filters: JobSearchFiltersDto,
  ): Promise<JobSearchDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const startTime = Date.now();

    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .skip((page - 1) * limit)
      .take(limit);

    // Apply search filters
    if (filters.search) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search OR nonprofitProfile.orgName ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.location) {
      queryBuilder.andWhere(
        '(nonprofitProfile.city ILIKE :location OR nonprofitProfile.state ILIKE :location OR nonprofitProfile.country ILIKE :location)',
        { location: `%${filters.location}%` },
      );
    }

    if (filters.employmentType) {
      queryBuilder.andWhere('job.employmentType = :employmentType', { 
        employmentType: filters.employmentType 
      });
    }

    if (filters.placement) {
      queryBuilder.andWhere('job.placement = :placement', { 
        placement: filters.placement 
      });
    }

    if (filters.salaryMin !== undefined) {
      queryBuilder.andWhere('job.salaryMin >= :salaryMin', { 
        salaryMin: filters.salaryMin 
      });
    }

    if (filters.salaryMax !== undefined) {
      queryBuilder.andWhere('job.salaryMax <= :salaryMax', { 
        salaryMax: filters.salaryMax 
      });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { 
        experienceLevel: filters.experienceLevel 
      });
    }

    if (filters.ngoId) {
      queryBuilder.andWhere('job.postedById = :ngoId', { ngoId: filters.ngoId });
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    queryBuilder.orderBy(`job.${sortBy}`, sortOrder);

    const [jobs, total] = await queryBuilder.getManyAndCount();

    // Transform jobs to search results
    const jobResults = await Promise.all(
      jobs.map(async (job) => this.transformToSearchResult(job)),
    );

    const searchTime = Date.now() - startTime;
    const totalPages = Math.ceil(total / limit);

    return {
      data: jobResults,
      total,
      page,
      limit,
      query: filters.search || '',
      filters,
      metadata: {
        searchTime,
        hasMore: page < totalPages,
        totalPages,
      },
    };
  }

  /**
   * Get personalized job recommendations for a user
   */
  async getRecommendedJobs(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<JobSearchDto> {
    const { page = 1, limit = 10 } = paginationDto;

    if (user.role !== Role.APPLICANT) {
      throw new Error('Only applicants can receive job recommendations');
    }

    // Get user's profile for matching
    const applicantProfile = await this.applicantRepository.findOne({
      where: { userId: user.id },
    });

    if (!applicantProfile) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        query: '',
        filters: {},
        metadata: {
          searchTime: 0,
          hasMore: false,
          totalPages: 0,
        },
      };
    }

    // Get user's applied jobs to exclude them
    const appliedJobIds = await this.applicationRepository
      .createQueryBuilder('application')
      .select('application.jobId')
      .where('application.applicantId = :applicantId', { applicantId: user.id })
      .getRawMany()
      .then(results => results.map(r => r.application_jobId));

    // Build recommendation query based on user profile
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .skip((page - 1) * limit)
      .take(limit);

    // Exclude already applied jobs
    if (appliedJobIds.length > 0) {
      queryBuilder.andWhere('job.id NOT IN (:...appliedJobIds)', { appliedJobIds });
    }

    // Match by location preference
    if (applicantProfile.city) {
      queryBuilder.orWhere('nonprofitProfile.city = :city', { 
        city: applicantProfile.city 
      });
    }

    // Match by employment type preference
    if (applicantProfile.preferredEmploymentType) {
      queryBuilder.orWhere('job.employmentType = :employmentType', { 
        employmentType: applicantProfile.preferredEmploymentType 
      });
    }

    // Order by relevance (newer jobs first, then by location match)
    queryBuilder.orderBy('job.createdAt', 'DESC');

    const [jobs, total] = await queryBuilder.getManyAndCount();

    // Transform jobs to search results with match scores
    const jobResults = await Promise.all(
      jobs.map(async (job) => {
        const result = await this.transformToSearchResult(job);
        result.matchScore = this.calculateMatchScore(job, applicantProfile);
        return result;
      }),
    );

    // Sort by match score
    jobResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return {
      data: jobResults,
      total,
      page,
      limit,
      query: '',
      filters: {},
      metadata: {
        searchTime: 0,
        hasMore: page < Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get trending/popular jobs
   */
  async getTrendingJobs(paginationDto: PaginationDto): Promise<JobSearchDto> {
    const { page = 1, limit = 10 } = paginationDto;

    // Get jobs with most applications in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingJobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('job.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const total = await this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('job.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    const jobResults = await Promise.all(
      trendingJobs.map(async (job) => this.transformToSearchResult(job)),
    );

    return {
      data: jobResults,
      total,
      page,
      limit,
      query: '',
      filters: {},
      metadata: {
        searchTime: 0,
        hasMore: page < Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get available search filters
   */
  async getSearchFilters(): Promise<SearchFiltersDto> {
    const [
      employmentTypes,
      placements,
      locations,
      experienceLevels,
      organizations,
      skills,
    ] = await Promise.all([
      this.jobRepository
        .createQueryBuilder('job')
        .select('DISTINCT job.employmentType', 'employmentType')
        .where('job.status = :status', { status: JobStatus.PUBLISHED })
        .getRawMany(),
      
      this.jobRepository
        .createQueryBuilder('job')
        .select('DISTINCT job.placement', 'placement')
        .where('job.status = :status', { status: JobStatus.PUBLISHED })
        .getRawMany(),

      this.nonprofitRepository
        .createQueryBuilder('nonprofit')
        .select('DISTINCT CONCAT(nonprofit.city, \', \', nonprofit.state, \', \', nonprofit.country)', 'location')
        .where('nonprofit.city IS NOT NULL')
        .getRawMany(),

      this.jobRepository
        .createQueryBuilder('job')
        .select('DISTINCT job.experienceLevel', 'experienceLevel')
        .where('job.status = :status', { status: JobStatus.PUBLISHED })
        .andWhere('job.experienceLevel IS NOT NULL')
        .getRawMany(),

      this.nonprofitRepository
        .createQueryBuilder('nonprofit')
        .select('nonprofit.userId', 'id')
        .addSelect('nonprofit.orgName', 'name')
        .addSelect('CONCAT(nonprofit.city, \', \', nonprofit.country)', 'location')
        .getRawMany(),

      this.jobRepository
        .createQueryBuilder('job')
        .select('DISTINCT UNNEST(job.requiredSkills)', 'skill')
        .where('job.status = :status', { status: JobStatus.PUBLISHED })
        .getRawMany(),
    ]);

    // Generate salary ranges
    const salaryRanges = [
      { label: 'Under $500', min: 0, max: 500 },
      { label: '$500 - $1,000', min: 500, max: 1000 },
      { label: '$1,000 - $2,500', min: 1000, max: 2500 },
      { label: '$2,500 - $5,000', min: 2500, max: 5000 },
      { label: 'Over $5,000', min: 5000, max: 999999 },
    ];

    return {
      employmentTypes: employmentTypes.map(item => item.employmentType),
      placements: placements.map(item => item.placement),
      locations: locations.map(item => item.location),
      experienceLevels: experienceLevels.map(item => item.experienceLevel),
      organizations: organizations.map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
      })),
      skills: skills.map(item => item.skill),
      salaryRanges,
    };
  }

  /**
   * Get jobs similar to a specific job
   */
  async getSimilarJobs(
    jobId: string,
    paginationDto: PaginationDto,
  ): Promise<JobSearchDto> {
    const { page = 1, limit = 10 } = paginationDto;

    // Get the reference job
    const referenceJob = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['postedBy', 'postedBy.nonprofitOrg'],
    });

    if (!referenceJob) {
      throw new Error('Job not found');
    }

    // Find similar jobs based on skills, employment type, and location
    const similarJobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
      .where('job.id != :jobId', { jobId })
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere(
        '(job.employmentType = :employmentType OR job.placement = :placement OR nonprofitProfile.city = :city)',
        {
          employmentType: referenceJob.employmentType,
          placement: referenceJob.placement,
          city: referenceJob.postedBy.nonprofitProfile?.city,
        },
      )
      .orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const total = await this.jobRepository
      .createQueryBuilder('job')
      .where('job.id != :jobId', { jobId })
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .getCount();

    const jobResults = await Promise.all(
      similarJobs.map(async (job) => this.transformToSearchResult(job)),
    );

    return {
      data: jobResults,
      total,
      page,
      limit,
      query: '',
      filters: {},
      metadata: {
        searchTime: 0,
        hasMore: page < Math.ceil(total / limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get jobs near a specific location
   */
  async getNearbyJobs(
    paginationDto: PaginationDto,
    location: NearbyJobsDto,
  ): Promise<JobSearchDto> {
    const { page = 1, limit = 10 } = paginationDto;
    const { latitude, longitude, radius = 50 } = location;

    // For now, we'll use a simple radius-based search
    // In production, you'd want to use PostGIS or similar for proper geospatial queries
    const nearbyJobs = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .andWhere('nonprofitProfile.latitude IS NOT NULL')
      .andWhere('nonprofitProfile.longitude IS NOT NULL')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Filter by distance (simplified calculation)
    const filteredJobs = nearbyJobs.filter(job => {
      const orgProfile = job.postedBy.nonprofitProfile;
      if (!orgProfile?.latitude || !orgProfile?.longitude) return false;
      
      const distance = this.calculateDistance(
        latitude,
        longitude,
        orgProfile.latitude,
        orgProfile.longitude,
      );
      
      return distance <= radius;
    });

    const jobResults = await Promise.all(
      filteredJobs.map(async (job) => this.transformToSearchResult(job)),
    );

    return {
      data: jobResults,
      total: filteredJobs.length,
      page,
      limit,
      query: '',
      filters: {},
      metadata: {
        searchTime: 0,
        hasMore: page < Math.ceil(filteredJobs.length / limit),
        totalPages: Math.ceil(filteredJobs.length / limit),
      },
    };
  }

  /**
   * Transform job entity to search result DTO
   */
  private async transformToSearchResult(job: Job): Promise<JobSearchResultDto> {
    const orgProfile = job.postedBy.nonprofitProfile;
    const applicantCount = await this.applicationRepository.count({
      where: { jobId: job.id },
    });

    const daysSincePosted = Math.floor(
      (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      id: job.id,
      title: job.title,
      description: job.description.substring(0, 200) + '...',
      employmentType: job.employmentType,
      placement: job.placement,
      status: job.status,
      postedAt: job.createdAt,
      deadline: job.deadline,
      salaryRange: job.salaryMin && job.salaryMax ? {
        min: job.salaryMin,
        max: job.salaryMax,
        currency: 'USD', // Default currency
      } : undefined,
      experienceLevel: job.experienceLevel,
      requiredSkills: job.requiredSkills || [],
      benefits: job.benefits || [],
      ngoId: job.postedById,
      orgName: orgProfile?.orgName || 'Unknown Organization',
      orgLogoUrl: orgProfile?.logoUrl,
      orgLocation: [
        orgProfile?.city,
        orgProfile?.state,
        orgProfile?.country,
      ].filter(Boolean).join(', '),
      orgSize: orgProfile?.sizeLabel,
      applicantCount,
      daysSincePosted,
      isBookmarked: false, // TODO: Implement bookmarking
      matchScore: undefined,
      applicationStatus: undefined,
    };
  }

  /**
   * Calculate match score between job and applicant profile
   */
  private calculateMatchScore(job: Job, profile: ApplicantProfile): number {
    let score = 0;

    // Location match (40 points)
    if (profile.city && job.postedBy.nonprofitProfile?.city === profile.city) {
      score += 40;
    } else if (profile.state && job.postedBy.nonprofitProfile?.state === profile.state) {
      score += 20;
    } else if (profile.country && job.postedBy.nonprofitProfile?.country === profile.country) {
      score += 10;
    }

    // Employment type match (30 points)
    if (profile.preferredEmploymentType === job.employmentType) {
      score += 30;
    }

    // Skills match (20 points)
    if (profile.skills && job.requiredSkills) {
      const matchingSkills = profile.skills.filter(skill =>
        job.requiredSkills.includes(skill),
      );
      const skillMatchPercentage = matchingSkills.length / job.requiredSkills.length;
      score += skillMatchPercentage * 20;
    }

    // Experience level match (10 points)
    if (profile.experienceLevel === job.experienceLevel) {
      score += 10;
    }

    return Math.round(score);
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Search jobs for applicants with additional applicant-specific logic
   */
  async searchJobsForApplicant(
    user: User,
    searchParams: any,
  ): Promise<{ jobs: any[]; total: number; page: number; limit: number; filters: any }> {
    const { page = 1, limit = 20, ...filters } = searchParams;
    
    const result = await this.searchJobs({ page, limit }, filters);
    
    return {
      jobs: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      filters: result.filters,
    };
  }

  /**
   * Get recommended jobs for applicants
   */
  async getRecommendedJobsForApplicant(
    user: User,
    limit: number = 10,
  ): Promise<{ jobs: any[]; total: number }> {
    const result = await this.getRecommendedJobs(user, { page: 1, limit });
    
    return {
      jobs: result.data,
      total: result.total,
    };
  }

  /**
   * Get saved jobs for applicants
   */
  async getSavedJobsForApplicant(
    user: User,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ jobs: any[]; total: number; page: number; limit: number }> {
    return this.savedJobsService.getSavedJobs(user.id, page, limit);
  }

  /**
   * Save a job for an applicant
   */
  async saveJobForApplicant(user: User, jobId: string): Promise<void> {
    await this.savedJobsService.saveJob(user.id, jobId);
  }

  /**
   * Unsave a job for an applicant
   */
  async unsaveJobForApplicant(user: User, jobId: string): Promise<void> {
    await this.savedJobsService.unsaveJob(user.id, jobId);
  }
}
