"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const job_search_service_1 = require("./job-search.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../../users/shared/user.entity");
const job_search_dto_1 = require("./dto/job-search.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let JobSearchController = class JobSearchController {
    jobSearchService;
    constructor(jobSearchService) {
        this.jobSearchService = jobSearchService;
    }
    searchJobs(paginationDto, search, location, employmentType, placement, salaryMin, salaryMax, experienceLevel, ngoId, sortBy, sortOrder) {
        const filters = {
            search,
            location,
            employmentType: employmentType,
            placement: placement,
            salaryMin,
            salaryMax,
            experienceLevel,
            ngoId,
            sortBy,
            sortOrder,
        };
        return this.jobSearchService.searchJobs(paginationDto, filters);
    }
    getRecommendedJobs(user, paginationDto) {
        return this.jobSearchService.getRecommendedJobs(user, paginationDto);
    }
    getTrendingJobs(paginationDto) {
        return this.jobSearchService.getTrendingJobs(paginationDto);
    }
    getSearchFilters() {
        return this.jobSearchService.getSearchFilters();
    }
    getSimilarJobs(jobId, paginationDto) {
        return this.jobSearchService.getSimilarJobs(jobId, paginationDto);
    }
    getNearbyJobs(paginationDto, latitude, longitude, radius) {
        return this.jobSearchService.getNearbyJobs(paginationDto, { latitude, longitude, radius });
    }
};
exports.JobSearchController = JobSearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search jobs with filters and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Jobs found successfully.', type: job_search_dto_1.JobSearchDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('location')),
    __param(3, (0, common_1.Query)('employmentType')),
    __param(4, (0, common_1.Query)('placement')),
    __param(5, (0, common_1.Query)('salaryMin')),
    __param(6, (0, common_1.Query)('salaryMax')),
    __param(7, (0, common_1.Query)('experienceLevel')),
    __param(8, (0, common_1.Query)('ngoId')),
    __param(9, (0, common_1.Query)('sortBy')),
    __param(10, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String, Number, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "searchJobs", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get personalized job recommendations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommended jobs retrieved successfully.', type: job_search_dto_1.JobSearchDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "getRecommendedJobs", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trending jobs retrieved successfully.', type: job_search_dto_1.JobSearchDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "getTrendingJobs", null);
__decorate([
    (0, common_1.Get)('filters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available search filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filter options retrieved successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "getSearchFilters", null);
__decorate([
    (0, common_1.Get)('similar/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get similar jobs to a specific job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Similar jobs retrieved successfully.', type: job_search_dto_1.JobSearchDto }),
    __param(0, (0, common_1.Param)('jobId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "getSimilarJobs", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Get jobs near a specific location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby jobs retrieved successfully.', type: job_search_dto_1.JobSearchDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('latitude')),
    __param(2, (0, common_1.Query)('longitude')),
    __param(3, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], JobSearchController.prototype, "getNearbyJobs", null);
exports.JobSearchController = JobSearchController = __decorate([
    (0, swagger_1.ApiTags)('Jobs - Search & Discovery'),
    (0, common_1.Controller)('jobs/search'),
    __metadata("design:paramtypes", [job_search_service_1.JobSearchService])
], JobSearchController);
//# sourceMappingURL=job-search.controller.js.map