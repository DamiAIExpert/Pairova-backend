import { JobSearchService } from './job-search.service';
import { User } from '../../users/shared/user.entity';
import { JobSearchDto } from './dto/job-search.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class JobSearchController {
    private readonly jobSearchService;
    constructor(jobSearchService: JobSearchService);
    searchJobs(paginationDto: PaginationDto, search?: string, location?: string, employmentType?: string, placement?: string, salaryMin?: number, salaryMax?: number, experienceLevel?: string, ngoId?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<JobSearchDto>;
    getRecommendedJobs(user: User, paginationDto: PaginationDto): Promise<JobSearchDto>;
    getTrendingJobs(paginationDto: PaginationDto): Promise<JobSearchDto>;
    getSearchFilters(): Promise<import("./dto/job-search.dto").SearchFiltersDto>;
    getSimilarJobs(jobId: string, paginationDto: PaginationDto): Promise<JobSearchDto>;
    getNearbyJobs(paginationDto: PaginationDto, latitude: number, longitude: number, radius?: number): Promise<JobSearchDto>;
}
