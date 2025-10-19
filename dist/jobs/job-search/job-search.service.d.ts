import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { Application } from '../entities/application.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { SavedJobsService } from '../saved-jobs/saved-jobs.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JobSearchDto, JobSearchFiltersDto, SearchFiltersDto, NearbyJobsDto } from './dto/job-search.dto';
export declare class JobSearchService {
    private readonly jobRepository;
    private readonly applicationRepository;
    private readonly userRepository;
    private readonly applicantRepository;
    private readonly nonprofitRepository;
    private readonly savedJobsService;
    constructor(jobRepository: Repository<Job>, applicationRepository: Repository<Application>, userRepository: Repository<User>, applicantRepository: Repository<ApplicantProfile>, nonprofitRepository: Repository<NonprofitOrg>, savedJobsService: SavedJobsService);
    searchJobs(paginationDto: PaginationDto, filters: JobSearchFiltersDto): Promise<JobSearchDto>;
    getRecommendedJobs(user: User, paginationDto: PaginationDto): Promise<JobSearchDto>;
    getTrendingJobs(paginationDto: PaginationDto): Promise<JobSearchDto>;
    getSearchFilters(): Promise<SearchFiltersDto>;
    getSimilarJobs(jobId: string, paginationDto: PaginationDto): Promise<JobSearchDto>;
    getNearbyJobs(paginationDto: PaginationDto, location: NearbyJobsDto): Promise<JobSearchDto>;
    private transformToSearchResult;
    private calculateMatchScore;
    private calculateDistance;
    private toRadians;
    searchJobsForApplicant(user: User, searchParams: any): Promise<{
        jobs: any[];
        total: number;
        page: number;
        limit: number;
        filters: any;
    }>;
    getRecommendedJobsForApplicant(user: User, limit?: number): Promise<{
        jobs: any[];
        total: number;
    }>;
    getSavedJobsForApplicant(user: User, page?: number, limit?: number): Promise<{
        jobs: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    saveJobForApplicant(user: User, jobId: string): Promise<void>;
    unsaveJobForApplicant(user: User, jobId: string): Promise<void>;
}
