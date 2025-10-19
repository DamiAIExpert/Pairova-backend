// src/jobs/job-search/dto/job-search.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { JobPlacement } from '../../../common/enums/job.enum';
import { JobStatus } from '../../../jobs/entities/job.entity';

export class JobSearchFiltersDto {
  @ApiProperty({ description: 'Search query', required: false })
  search?: string;

  @ApiProperty({ description: 'Location filter', required: false })
  location?: string;

  @ApiProperty({ description: 'Employment type filter', enum: EmploymentType, required: false })
  employmentType?: EmploymentType;

  @ApiProperty({ description: 'Placement filter', enum: JobPlacement, required: false })
  placement?: JobPlacement;

  @ApiProperty({ description: 'Minimum salary', required: false })
  salaryMin?: number;

  @ApiProperty({ description: 'Maximum salary', required: false })
  salaryMax?: number;

  @ApiProperty({ description: 'Experience level filter', required: false })
  experienceLevel?: string;

  @ApiProperty({ description: 'NGO ID filter', required: false })
  ngoId?: string;

  @ApiProperty({ description: 'Sort by field', required: false })
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', enum: ['ASC', 'DESC'], required: false })
  sortOrder?: 'ASC' | 'DESC';
}

export class JobSearchResultDto {
  @ApiProperty({ description: 'Job ID' })
  id: string;

  @ApiProperty({ description: 'Job title' })
  title: string;

  @ApiProperty({ description: 'Job description (truncated)' })
  description: string;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiProperty({ description: 'Job placement', enum: JobPlacement })
  placement: JobPlacement;

  @ApiProperty({ description: 'Job status', enum: JobStatus })
  status: JobStatus;

  @ApiProperty({ description: 'Date posted' })
  postedAt: Date;

  @ApiProperty({ description: 'Application deadline', required: false })
  deadline?: Date;

  @ApiProperty({ description: 'Salary range', required: false })
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };

  @ApiProperty({ description: 'Required experience level', required: false })
  experienceLevel?: string;

  @ApiProperty({ description: 'Required skills', type: [String] })
  requiredSkills: string[];

  @ApiProperty({ description: 'Benefits', type: [String], required: false })
  benefits?: string[];

  // Organization information
  @ApiProperty({ description: 'NGO ID' })
  ngoId: string;

  @ApiProperty({ description: 'Organization name' })
  orgName: string;

  @ApiProperty({ description: 'Organization logo URL', required: false })
  orgLogoUrl?: string;

  @ApiProperty({ description: 'Organization location' })
  orgLocation: string;

  @ApiProperty({ description: 'Organization size', required: false })
  orgSize?: string;

  // Application statistics
  @ApiProperty({ description: 'Number of applicants' })
  applicantCount: number;

  @ApiProperty({ description: 'Days since posted' })
  daysSincePosted: number;

  @ApiProperty({ description: 'Is job bookmarked by user', required: false })
  isBookmarked?: boolean;

  @ApiProperty({ description: 'Match score (for recommendations)', required: false })
  matchScore?: number;

  @ApiProperty({ description: 'Application status (if user applied)', required: false })
  applicationStatus?: string;
}

export class JobSearchDto {
  @ApiProperty({ type: [JobSearchResultDto], description: 'List of jobs' })
  data: JobSearchResultDto[];

  @ApiProperty({ description: 'Total number of jobs found' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Search query used' })
  query: string;

  @ApiProperty({ description: 'Filters applied' })
  filters: JobSearchFiltersDto;

  @ApiProperty({ description: 'Search metadata' })
  metadata: {
    searchTime: number;
    hasMore: boolean;
    totalPages: number;
  };
}

export class SearchFiltersDto {
  @ApiProperty({ description: 'Available employment types', type: [String] })
  employmentTypes: string[];

  @ApiProperty({ description: 'Available job placements', type: [String] })
  placements: string[];

  @ApiProperty({ description: 'Available locations', type: [String] })
  locations: string[];

  @ApiProperty({ description: 'Available experience levels', type: [String] })
  experienceLevels: string[];

  @ApiProperty({ description: 'Available NGO organizations', type: [String] })
  organizations: Array<{
    id: string;
    name: string;
    location: string;
  }>;

  @ApiProperty({ description: 'Available skills', type: [String] })
  skills: string[];

  @ApiProperty({ description: 'Salary ranges', type: [Object] })
  salaryRanges: Array<{
    label: string;
    min: number;
    max: number;
  }>;
}

export class NearbyJobsDto {
  @ApiProperty({ description: 'Latitude coordinate' })
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  longitude: number;

  @ApiProperty({ description: 'Search radius in kilometers', required: false })
  radius?: number;
}
