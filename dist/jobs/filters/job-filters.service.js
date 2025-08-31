"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobFiltersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let JobFiltersService = class JobFiltersService {
    applyFilters(queryBuilder, filters) {
        if (filters.query) {
            queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
                qb.where('job.title ILIKE :query', { query: `%${filters.query}%` })
                    .orWhere('job.description ILIKE :query', { query: `%${filters.query}%` })
                    .orWhere('organization.orgName ILIKE :query', { query: `%${filters.query}%` });
            }));
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
};
exports.JobFiltersService = JobFiltersService;
exports.JobFiltersService = JobFiltersService = __decorate([
    (0, common_1.Injectable)()
], JobFiltersService);
//# sourceMappingURL=job-filters.service.js.map