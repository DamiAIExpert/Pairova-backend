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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatisticsDto = exports.ApplicationPipelineDto = exports.UpdateApplicationStatusDto = exports.AdminApplicationListDto = exports.AdminApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const application_entity_1 = require("../../../jobs/entities/application.entity");
const employment_type_enum_1 = require("../../../common/enums/employment-type.enum");
const job_enum_1 = require("../../../common/enums/job.enum");
class AdminApplicationDto {
    id;
    status;
    createdAt;
    updatedAt;
    coverLetter;
    resumeUrl;
    applicantId;
    applicantName;
    applicantEmail;
    applicantPhotoUrl;
    applicantPhone;
    applicantLocation;
    jobId;
    jobTitle;
    jobDescription;
    employmentType;
    placement;
    ngoId;
    ngoName;
    ngoLogoUrl;
    ngoLocation;
    matchScore;
    daysSinceApplication;
}
exports.AdminApplicationDto = AdminApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application ID' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application status', enum: application_entity_1.ApplicationStatus }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application creation date' }),
    __metadata("design:type", Date)
], AdminApplicationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application last update date' }),
    __metadata("design:type", Date)
], AdminApplicationDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cover letter', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "coverLetter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resume URL', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "resumeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant ID' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant name' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant email' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant photo URL', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantPhotoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant phone', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicant location', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "applicantLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job description' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "jobDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employment type', enum: employment_type_enum_1.EmploymentType }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job placement', enum: job_enum_1.JobPlacement }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "placement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO ID' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "ngoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO name' }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "ngoName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO logo URL', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "ngoLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NGO location', required: false }),
    __metadata("design:type", String)
], AdminApplicationDto.prototype, "ngoLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score', required: false }),
    __metadata("design:type", Number)
], AdminApplicationDto.prototype, "matchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Days since application' }),
    __metadata("design:type", Number)
], AdminApplicationDto.prototype, "daysSinceApplication", void 0);
class AdminApplicationListDto {
    data;
    total;
    page;
    limit;
}
exports.AdminApplicationListDto = AdminApplicationListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminApplicationDto], description: 'List of applications' }),
    __metadata("design:type", Array)
], AdminApplicationListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applications' }),
    __metadata("design:type", Number)
], AdminApplicationListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], AdminApplicationListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], AdminApplicationListDto.prototype, "limit", void 0);
class UpdateApplicationStatusDto {
    status;
    notes;
}
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New application status', enum: application_entity_1.ApplicationStatus }),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admin notes about the status change', required: false }),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "notes", void 0);
class ApplicationPipelineDto {
    pending;
    underReview;
    interview;
    hired;
    denied;
    withdrawn;
    total;
    hiringRate;
    averageTimeToHire;
}
exports.ApplicationPipelineDto = ApplicationPipelineDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications pending review' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications under review' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "underReview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications in interview stage' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "interview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications hired' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "hired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications denied' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "denied", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications withdrawn' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "withdrawn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total applications' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hiring rate percentage' }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "hiringRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average time to hire (days)', required: false }),
    __metadata("design:type", Number)
], ApplicationPipelineDto.prototype, "averageTimeToHire", void 0);
class ApplicationStatisticsDto {
    totalApplications;
    applicationsThisMonth;
    applicationsByStatus;
    averageApplicationsPerJob;
    topJobs;
    hiringRate;
    averageTimeToHire;
}
exports.ApplicationStatisticsDto = ApplicationStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total applications' }),
    __metadata("design:type", Number)
], ApplicationStatisticsDto.prototype, "totalApplications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications this month' }),
    __metadata("design:type", Number)
], ApplicationStatisticsDto.prototype, "applicationsThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications by status' }),
    __metadata("design:type", Object)
], ApplicationStatisticsDto.prototype, "applicationsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average applications per job' }),
    __metadata("design:type", Number)
], ApplicationStatisticsDto.prototype, "averageApplicationsPerJob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Top performing jobs (by application count)' }),
    __metadata("design:type", Array)
], ApplicationStatisticsDto.prototype, "topJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hiring rate percentage' }),
    __metadata("design:type", Number)
], ApplicationStatisticsDto.prototype, "hiringRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average time to hire (days)', required: false }),
    __metadata("design:type", Number)
], ApplicationStatisticsDto.prototype, "averageTimeToHire", void 0);
//# sourceMappingURL=admin-application.dto.js.map