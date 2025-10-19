// src/jobs/job-search/job-search.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobSearchService } from './job-search.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { JobSearchDto, JobSearchFiltersDto } from './dto/job-search.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { JobPlacement } from '../../common/enums/job.enum';

/**
 * @class JobSearchController
 * @description Provides endpoints for job search and discovery functionality.
 */
@ApiTags('Jobs')
@Controller('jobs/search')
export class JobSearchController {
  constructor(private readonly jobSearchService: JobSearchService) {}

  /**
   * @route GET /jobs/search
   * @description Search and filter jobs with advanced options.
   */
  @Get()
  @ApiOperation({ summary: 'Search jobs with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Jobs found successfully.', type: JobSearchDto })
  searchJobs(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('employmentType') employmentType?: string,
    @Query('placement') placement?: string,
    @Query('salaryMin') salaryMin?: number,
    @Query('salaryMax') salaryMax?: number,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('ngoId') ngoId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters: JobSearchFiltersDto = {
      search,
      location,
      employmentType: employmentType as EmploymentType,
      placement: placement as JobPlacement,
      salaryMin,
      salaryMax,
      experienceLevel,
      ngoId,
      sortBy,
      sortOrder,
    };

    return this.jobSearchService.searchJobs(paginationDto, filters);
  }

  /**
   * @route GET /jobs/search/recommended
   * @description Get personalized job recommendations for authenticated user.
   */
  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized job recommendations' })
  @ApiResponse({ status: 200, description: 'Recommended jobs retrieved successfully.', type: JobSearchDto })
  getRecommendedJobs(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.jobSearchService.getRecommendedJobs(user, paginationDto);
  }

  /**
   * @route GET /jobs/search/trending
   * @description Get trending/popular jobs.
   */
  @Get('trending')
  @ApiOperation({ summary: 'Get trending jobs' })
  @ApiResponse({ status: 200, description: 'Trending jobs retrieved successfully.', type: JobSearchDto })
  getTrendingJobs(@Query() paginationDto: PaginationDto) {
    return this.jobSearchService.getTrendingJobs(paginationDto);
  }

  /**
   * @route GET /jobs/search/filters
   * @description Get available filter options for job search.
   */
  @Get('filters')
  @ApiOperation({ summary: 'Get available search filters' })
  @ApiResponse({ status: 200, description: 'Filter options retrieved successfully.' })
  getSearchFilters() {
    return this.jobSearchService.getSearchFilters();
  }

  /**
   * @route GET /jobs/search/similar/:jobId
   * @description Get jobs similar to a specific job.
   */
  @Get('similar/:jobId')
  @ApiOperation({ summary: 'Get similar jobs to a specific job' })
  @ApiResponse({ status: 200, description: 'Similar jobs retrieved successfully.', type: JobSearchDto })
  getSimilarJobs(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.jobSearchService.getSimilarJobs(jobId, paginationDto);
  }

  /**
   * @route GET /jobs/search/nearby
   * @description Get jobs near a specific location.
   */
  @Get('nearby')
  @ApiOperation({ summary: 'Get jobs near a specific location' })
  @ApiResponse({ status: 200, description: 'Nearby jobs retrieved successfully.', type: JobSearchDto })
  getNearbyJobs(
    @Query() paginationDto: PaginationDto,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.jobSearchService.getNearbyJobs(paginationDto, { latitude, longitude, radius });
  }
}
