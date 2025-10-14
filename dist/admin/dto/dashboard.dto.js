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
exports.RecommendationsDto = exports.RecommendationDto = exports.ActivityFeedDto = exports.ActivityItem = exports.PerformanceMetricsDto = exports.PerformanceDataPoint = exports.DashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardStatsDto {
    totalUsers;
    totalApplicants;
    totalNonprofits;
    totalJobs;
    totalApplications;
    activeJobs;
    verifiedUsers;
    applicationsThisMonth;
    newUsersThisMonth;
    hiringRate;
    averageApplicationsPerJob;
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of users' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applicants' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalApplicants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of nonprofits' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalNonprofits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of jobs' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of applications' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalApplications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active jobs count' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "activeJobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Verified users count' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "verifiedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications this month' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "applicationsThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New users this month' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "newUsersThisMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hiring rate percentage' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "hiringRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average applications per job' }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "averageApplicationsPerJob", void 0);
class PerformanceDataPoint {
    date;
    value;
}
exports.PerformanceDataPoint = PerformanceDataPoint;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date in ISO format' }),
    __metadata("design:type", String)
], PerformanceDataPoint.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value for this date' }),
    __metadata("design:type", Number)
], PerformanceDataPoint.prototype, "value", void 0);
class PerformanceMetricsDto {
    userRegistrations;
    jobPostings;
    applications;
    successfulMatches;
    period;
}
exports.PerformanceMetricsDto = PerformanceMetricsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User registrations over time', type: [PerformanceDataPoint] }),
    __metadata("design:type", Array)
], PerformanceMetricsDto.prototype, "userRegistrations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job postings over time', type: [PerformanceDataPoint] }),
    __metadata("design:type", Array)
], PerformanceMetricsDto.prototype, "jobPostings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applications over time', type: [PerformanceDataPoint] }),
    __metadata("design:type", Array)
], PerformanceMetricsDto.prototype, "applications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Successful matches over time', type: [PerformanceDataPoint] }),
    __metadata("design:type", Array)
], PerformanceMetricsDto.prototype, "successfulMatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time period covered' }),
    __metadata("design:type", String)
], PerformanceMetricsDto.prototype, "period", void 0);
class ActivityItem {
    id;
    type;
    description;
    user;
    entityId;
    timestamp;
    metadata;
}
exports.ActivityItem = ActivityItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity ID' }),
    __metadata("design:type", String)
], ActivityItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity type' }),
    __metadata("design:type", String)
], ActivityItem.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity description' }),
    __metadata("design:type", String)
], ActivityItem.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who performed the action', required: false }),
    __metadata("design:type", Object)
], ActivityItem.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Related entity ID', required: false }),
    __metadata("design:type", String)
], ActivityItem.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity timestamp' }),
    __metadata("design:type", Date)
], ActivityItem.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    __metadata("design:type", Object)
], ActivityItem.prototype, "metadata", void 0);
class ActivityFeedDto {
    activities;
    total;
}
exports.ActivityFeedDto = ActivityFeedDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of recent activities', type: [ActivityItem] }),
    __metadata("design:type", Array)
], ActivityFeedDto.prototype, "activities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of activities' }),
    __metadata("design:type", Number)
], ActivityFeedDto.prototype, "total", void 0);
class RecommendationDto {
    id;
    type;
    title;
    description;
    priority;
    entityIds;
    actionUrl;
    createdAt;
}
exports.RecommendationDto = RecommendationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendation ID' }),
    __metadata("design:type", String)
], RecommendationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendation type' }),
    __metadata("design:type", String)
], RecommendationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendation title' }),
    __metadata("design:type", String)
], RecommendationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommendation description' }),
    __metadata("design:type", String)
], RecommendationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Priority level (1-5)' }),
    __metadata("design:type", Number)
], RecommendationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Related entity IDs', required: false }),
    __metadata("design:type", Array)
], RecommendationDto.prototype, "entityIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action URL', required: false }),
    __metadata("design:type", String)
], RecommendationDto.prototype, "actionUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], RecommendationDto.prototype, "createdAt", void 0);
class RecommendationsDto {
    recommendations;
    highPriorityCount;
}
exports.RecommendationsDto = RecommendationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of recommendations', type: [RecommendationDto] }),
    __metadata("design:type", Array)
], RecommendationsDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'High priority recommendations count' }),
    __metadata("design:type", Number)
], RecommendationsDto.prototype, "highPriorityCount", void 0);
//# sourceMappingURL=dashboard.dto.js.map