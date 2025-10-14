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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearbyJobsDto = exports.SearchFiltersDto = exports.JobSearchFiltersDto = exports.JobSearchDto = exports.JobSearchResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const employment_type_enum_1 = require("../../../common/enums/employment-type.enum");
const job_enum_1 = require("../../../common/enums/job.enum");
const job_entity_1 = require("../../../jobs/entities/job.entity");
class JobSearchResultDto {
    id;
    title;
    description;
    employmentType;
    placement;
    status;
    postedAt;
    deadline;
    salaryRange;
    experienceLevel;
    requiredSkills;
    benefits;
    ngoId;
    orgName;
    orgLogoUrl;
    orgLocation;
    orgSize;
    applicantCount;
    daysSincePosted;
    isBookmarked;
    matchScore;
    applicationStatus;
}
exports.JobSearchResultDto = JobSearchResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job description (truncated)' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type', enum: employment_type_enum_1.EmploymentType }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job placement', enum: job_enum_1.JobPlacement }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job status', enum: job_entity_1.JobStatus }),
    __metadata("design:type", typeof (_a = typeof job_entity_1.JobStatus !== "undefined" && job_entity_1.JobStatus) === "function" ? _a : Object)
], JobSearchResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date posted' }),
    __metadata("design:type", Date)
], JobSearchResultDto.prototype, "postedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application deadline', required: false }),
    __metadata("design:type", Date)
], JobSearchResultDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salary range', required: false }),
    __metadata("design:type", Object)
], JobSearchResultDto.prototype, "salaryRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required experience level', required: false }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required skills', type: [String] }),
    __metadata("design:type", Array)
], JobSearchResultDto.prototype, "requiredSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Benefits', type: [String], required: false }),
    __metadata("design:type", Array)
], JobSearchResultDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO ID' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "ngoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization logo URL', required: false }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "orgLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization location' }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "orgLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization size', required: false }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "orgSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of applicants' }),
    __metadata("design:type", Number)
], JobSearchResultDto.prototype, "applicantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Days since posted' }),
    __metadata("design:type", Number)
], JobSearchResultDto.prototype, "daysSincePosted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is job bookmarked by user', required: false }),
    __metadata("design:type", Boolean)
], JobSearchResultDto.prototype, "isBookmarked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score (for recommendations)', required: false }),
    __metadata("design:type", Number)
], JobSearchResultDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application status (if user applied)', required: false }),
    __metadata("design:type", String)
], JobSearchResultDto.prototype, "applicationStatus", void 0);
class JobSearchDto {
    data;
    total;
    page;
    limit;
    query;
    filters;
    metadata;
}
exports.JobSearchDto = JobSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [JobSearchResultDto], description: 'List of jobs' }),
    __metadata("design:type", Array)
], JobSearchDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of jobs found' }),
    __metadata("design:type", Number)
], JobSearchDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], JobSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], JobSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search query used' }),
    __metadata("design:type", String)
], JobSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filters applied' }),
    __metadata("design:type", JobSearchFiltersDto)
], JobSearchDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search metadata' }),
    __metadata("design:type", Object)
], JobSearchDto.prototype, "metadata", void 0);
class JobSearchFiltersDto {
    search;
    location;
    employmentType;
    placement;
    salaryMin;
    salaryMax;
    experienceLevel;
    ngoId;
    sortBy;
    sortOrder;
}
exports.JobSearchFiltersDto = JobSearchFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search query', required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Location filter', required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type filter', enum: employment_type_enum_1.EmploymentType, required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Placement filter', enum: job_enum_1.JobPlacement, required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum salary', required: false }),
    __metadata("design:type", Number)
], JobSearchFiltersDto.prototype, "salaryMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum salary', required: false }),
    __metadata("design:type", Number)
], JobSearchFiltersDto.prototype, "salaryMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Experience level filter', required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "experienceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO ID filter', required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "ngoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort by field', required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort order', enum: ['ASC', 'DESC'], required: false }),
    __metadata("design:type", String)
], JobSearchFiltersDto.prototype, "sortOrder", void 0);
class SearchFiltersDto {
    employmentTypes;
    placements;
    locations;
    experienceLevels;
    organizations;
    skills;
    salaryRanges;
}
exports.SearchFiltersDto = SearchFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available employment types', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "employmentTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available job placements', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "placements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available locations', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "locations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available experience levels', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "experienceLevels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available NGO organizations', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "organizations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available skills', type: [String] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salary ranges', type: [Object] }),
    __metadata("design:type", Array)
], SearchFiltersDto.prototype, "salaryRanges", void 0);
class NearbyJobsDto {
    latitude;
    longitude;
    radius;
}
exports.NearbyJobsDto = NearbyJobsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude coordinate' }),
    __metadata("design:type", Number)
], NearbyJobsDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude coordinate' }),
    __metadata("design:type", Number)
], NearbyJobsDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search radius in kilometers', required: false }),
    __metadata("design:type", Number)
], NearbyJobsDto.prototype, "radius", void 0);
//# sourceMappingURL=job-search.dto.js.map