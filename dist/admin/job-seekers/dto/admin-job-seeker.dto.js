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
exports.AppliedJobsListDto = exports.AppliedJobDto = exports.AdminJobSeekerListDto = exports.AdminJobSeekerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const gender_enum_1 = require("../../../common/enums/gender.enum");
const application_entity_1 = require("../../../jobs/entities/application.entity");
class AdminJobSeekerDto {
    id;
    email;
    isVerified;
    phone;
    lastLoginAt;
    createdAt;
    updatedAt;
    firstName;
    lastName;
    name;
    gender;
    dob;
    bio;
    country;
    state;
    city;
    photoUrl;
    portfolioUrl;
    applicationCount;
    averageMatchScore;
    applicationDate;
    currentStatus;
}
exports.AdminJobSeekerDto = AdminJobSeekerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address' }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user is verified' }),
    __metadata("design:type", Boolean)
], AdminJobSeekerDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp', required: false }),
    __metadata("design:type", Date)
], AdminJobSeekerDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account creation timestamp' }),
    __metadata("design:type", Date)
], AdminJobSeekerDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AdminJobSeekerDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name (computed)' }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gender', enum: gender_enum_1.Gender, required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth', required: false }),
    __metadata("design:type", Date)
], AdminJobSeekerDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bio/description', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profile photo URL', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Portfolio URL', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "portfolioUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applications' }),
    __metadata("design:type", Number)
], AdminJobSeekerDto.prototype, "applicationCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average match score', required: false }),
    __metadata("design:type", Number)
], AdminJobSeekerDto.prototype, "averageMatchScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application date (most recent)', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "applicationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current application status', required: false }),
    __metadata("design:type", String)
], AdminJobSeekerDto.prototype, "currentStatus", void 0);
class AdminJobSeekerListDto {
    data;
    total;
    page;
    limit;
}
exports.AdminJobSeekerListDto = AdminJobSeekerListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminJobSeekerDto], description: 'List of job seekers' }),
    __metadata("design:type", Array)
], AdminJobSeekerListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of job seekers' }),
    __metadata("design:type", Number)
], AdminJobSeekerListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], AdminJobSeekerListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], AdminJobSeekerListDto.prototype, "limit", void 0);
class AppliedJobDto {
    id;
    jobId;
    jobTitle;
    orgName;
    status;
    appliedAt;
    matchScore;
}
exports.AppliedJobDto = AppliedJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application ID' }),
    __metadata("design:type", String)
], AppliedJobDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job ID' }),
    __metadata("design:type", String)
], AppliedJobDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title' }),
    __metadata("design:type", String)
], AppliedJobDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name' }),
    __metadata("design:type", String)
], AppliedJobDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application status', enum: application_entity_1.ApplicationStatus }),
    __metadata("design:type", String)
], AppliedJobDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application date' }),
    __metadata("design:type", Date)
], AppliedJobDto.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Match score', required: false }),
    __metadata("design:type", Number)
], AppliedJobDto.prototype, "matchScore", void 0);
class AppliedJobsListDto {
    data;
    total;
    page;
    limit;
}
exports.AppliedJobsListDto = AppliedJobsListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AppliedJobDto], description: 'List of applied jobs' }),
    __metadata("design:type", Array)
], AppliedJobsListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applications' }),
    __metadata("design:type", Number)
], AppliedJobsListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], AppliedJobsListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], AppliedJobsListDto.prototype, "limit", void 0);
//# sourceMappingURL=admin-job-seeker.dto.js.map