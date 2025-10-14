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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoStatisticsDto = exports.JobApplicantsListDto = exports.JobApplicantDto = exports.NgoJobsListDto = exports.NgoJobDto = exports.AdminNgoListDto = exports.AdminNgoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_entity_1 = require("../../../jobs/entities/job.entity");
const application_entity_1 = require("../../../jobs/entities/application.entity");
class AdminNgoDto {
    id;
    email;
    isVerified;
    phone;
    lastLoginAt;
    createdAt;
    updatedAt;
    orgName;
    logoUrl;
    website;
    mission;
    values;
    sizeLabel;
    orgType;
    industry;
    foundedOn;
    taxId;
    country;
    state;
    city;
    addressLine1;
    addressLine2;
    jobCount;
    applicationCount;
    activeJobCount;
}
exports.AdminNgoDto = AdminNgoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address' }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user is verified' }),
    __metadata("design:type", Boolean)
], AdminNgoDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp', required: false }),
    __metadata("design:type", Date)
], AdminNgoDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account creation timestamp' }),
    __metadata("design:type", Date)
], AdminNgoDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AdminNgoDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization logo URL', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization website', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization mission', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "mission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization values', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization size label', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "sizeLabel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization type', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "orgType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Industry', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Founded date', required: false }),
    __metadata("design:type", Date)
], AdminNgoDto.prototype, "foundedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax ID', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "taxId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address line 1', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address line 2', required: false }),
    __metadata("design:type", String)
], AdminNgoDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of jobs posted' }),
    __metadata("design:type", Number)
], AdminNgoDto.prototype, "jobCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applications received' }),
    __metadata("design:type", Number)
], AdminNgoDto.prototype, "applicationCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active jobs' }),
    __metadata("design:type", Number)
], AdminNgoDto.prototype, "activeJobCount", void 0);
class AdminNgoListDto {
    data;
    total;
    page;
    limit;
}
exports.AdminNgoListDto = AdminNgoListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminNgoDto], description: 'List of NGOs' }),
    __metadata("design:type", Array)
], AdminNgoListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of NGOs' }),
    __metadata("design:type", Number)
], AdminNgoListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], AdminNgoListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], AdminNgoListDto.prototype, "limit", void 0);
class NgoJobDto {
    id;
    title;
    description;
    employmentType;
    placement;
    status;
    postedAt;
    applicationCount;
}
exports.NgoJobDto = NgoJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    __metadata("design:type", String)
], NgoJobDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title' }),
    __metadata("design:type", String)
], NgoJobDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job description' }),
    __metadata("design:type", String)
], NgoJobDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type' }),
    __metadata("design:type", String)
], NgoJobDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job placement (remote/onsite/hybrid)' }),
    __metadata("design:type", String)
], NgoJobDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job status', enum: job_entity_1.JobStatus }),
    __metadata("design:type", typeof (_a = typeof job_entity_1.JobStatus !== "undefined" && job_entity_1.JobStatus) === "function" ? _a : Object)
], NgoJobDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date posted' }),
    __metadata("design:type", Date)
], NgoJobDto.prototype, "postedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of applications received' }),
    __metadata("design:type", Number)
], NgoJobDto.prototype, "applicationCount", void 0);
class NgoJobsListDto {
    data;
    total;
    page;
    limit;
}
exports.NgoJobsListDto = NgoJobsListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [NgoJobDto], description: 'List of jobs' }),
    __metadata("design:type", Array)
], NgoJobsListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of jobs' }),
    __metadata("design:type", Number)
], NgoJobsListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], NgoJobsListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], NgoJobsListDto.prototype, "limit", void 0);
class JobApplicantDto {
    applicationId;
    applicantId;
    applicantName;
    applicantEmail;
    status;
    appliedAt;
    matchScore;
    photoUrl;
}
exports.JobApplicantDto = JobApplicantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application ID' }),
    __metadata("design:type", String)
], JobApplicantDto.prototype, "applicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    __metadata("design:type", String)
], JobApplicantDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant name' }),
    __metadata("design:type", String)
], JobApplicantDto.prototype, "applicantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant email' }),
    __metadata("design:type", String)
], JobApplicantDto.prototype, "applicantEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application status', enum: application_entity_1.ApplicationStatus }),
    __metadata("design:type", typeof (_b = typeof application_entity_1.ApplicationStatus !== "undefined" && application_entity_1.ApplicationStatus) === "function" ? _b : Object)
], JobApplicantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application date' }),
    __metadata("design:type", Date)
], JobApplicantDto.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score', required: false }),
    __metadata("design:type", Number)
], JobApplicantDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant photo URL', required: false }),
    __metadata("design:type", String)
], JobApplicantDto.prototype, "photoUrl", void 0);
class JobApplicantsListDto {
    data;
    total;
    page;
    limit;
}
exports.JobApplicantsListDto = JobApplicantsListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [JobApplicantDto], description: 'List of job applicants' }),
    __metadata("design:type", Array)
], JobApplicantsListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applicants' }),
    __metadata("design:type", Number)
], JobApplicantsListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], JobApplicantsListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], JobApplicantsListDto.prototype, "limit", void 0);
class NgoStatisticsDto {
    totalJobs;
    activeJobs;
    totalApplications;
    applicationsByStatus;
    jobsByStatus;
    averageApplicationsPerJob;
    hiringRate;
}
exports.NgoStatisticsDto = NgoStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total jobs posted' }),
    __metadata("design:type", Number)
], NgoStatisticsDto.prototype, "totalJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active jobs' }),
    __metadata("design:type", Number)
], NgoStatisticsDto.prototype, "activeJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total applications received' }),
    __metadata("design:type", Number)
], NgoStatisticsDto.prototype, "totalApplications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications by status' }),
    __metadata("design:type", Object)
], NgoStatisticsDto.prototype, "applicationsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Jobs by status' }),
    __metadata("design:type", Object)
], NgoStatisticsDto.prototype, "jobsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average applications per job' }),
    __metadata("design:type", Number)
], NgoStatisticsDto.prototype, "averageApplicationsPerJob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hiring rate (percentage)' }),
    __metadata("design:type", Number)
], NgoStatisticsDto.prototype, "hiringRate", void 0);
//# sourceMappingURL=admin-ngo.dto.js.map