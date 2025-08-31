// src/jobs/filters/job-filters.service.ts
import { Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { Brackets, SelectQueryBuilder } from 'typeorm';

export interface JobFilterParams {
  query?: string;
  employmentTypes?: string[];
  placements?: string[];
  minSalary?: number;
  maxSalary?: number;
}

/**
 * @class JobFiltersService
 * @description Provides advanced filtering capabilities for job searches.
 */
@Injectable()
export class JobFiltersService {

  /**
   * Applies various filters to a job query builder.
   * @param queryBuilder - The TypeORM SelectQueryBuilder for jobs.
   * @param filters - The filter parameters.
   * @returns The modified query builder.
   */
  applyFilters(
    queryBuilder: SelectQueryBuilder<Job>,
    filters: JobFilterParams,
  ): SelectQueryBuilder<Job> {
    if (filters.query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('job.title ILIKE :query', { query: `%${filters.query}%` })
            .orWhere('job.description ILIKE :query', { query: `%${filters.query}%` })
            .orWhere('organization.orgName ILIKE :query', { query: `%${filters.query}%` });
        }),
      );
    }

    if (filters.employmentTypes?.length > 0) {
      queryBuilder.andWhere('job.employmentType IN (:...employmentTypes)', {
        employmentTypes: filters.employmentTypes,
      });
    }

    if (filters.placements?.length > 0) {
      queryBuilder.andWhere('job.placement IN (:...placements)', {
        placements: filters.placements,
      });
    }

    if (filters.minSalary) {
      queryBuilder.andWhere('job.salaryMax >= :minSalary', { minSalary: filters.minSalary });
    }
    
    if (filters.maxSalary) {
        queryBuilder.andWhere('job.salaryMin <= :maxSalary', { maxSalary: filters.maxSalary });
    }

    return queryBuilder;
  }
}
