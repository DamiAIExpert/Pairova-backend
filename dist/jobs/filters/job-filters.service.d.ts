import { Job } from '../entities/job.entity';
import { SelectQueryBuilder } from 'typeorm';
export interface JobFilterParams {
    query?: string;
    employmentTypes?: string[];
    placements?: string[];
    minSalary?: number;
    maxSalary?: number;
}
export declare class JobFiltersService {
    applyFilters(queryBuilder: SelectQueryBuilder<Job>, filters: JobFilterParams): SelectQueryBuilder<Job>;
}
