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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/shared/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../jobs/entities/application.entity");
const role_enum_1 = require("../common/enums/role.enum");
const job_entity_2 = require("../jobs/entities/job.entity");
const application_entity_2 = require("../jobs/entities/application.entity");
let AdminService = class AdminService {
    userRepository;
    jobRepository;
    applicationRepository;
    constructor(userRepository, jobRepository, applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }
    async getDashboardStats() {
        const totalUsers = await this.userRepository.count();
        const totalApplicants = await this.userRepository.count({ where: { role: role_enum_1.Role.APPLICANT } });
        const totalNonprofits = await this.userRepository.count({ where: { role: role_enum_1.Role.NONPROFIT } });
        const totalJobs = await this.jobRepository.count();
        const totalApplications = await this.applicationRepository.count();
        const activeJobs = await this.jobRepository.count({ where: { status: job_entity_2.JobStatus.PUBLISHED } });
        const verifiedUsers = await this.userRepository.count({ where: { isVerified: true } });
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const applicationsThisMonth = await this.applicationRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(startOfMonth, new Date()),
            },
        });
        const newUsersThisMonth = await this.userRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(startOfMonth, new Date()),
            },
        });
        const hiredApplications = await this.applicationRepository.count({
            where: { status: application_entity_2.ApplicationStatus.ACCEPTED },
        });
        const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
        const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
        return {
            totalUsers,
            totalApplicants,
            totalNonprofits,
            totalJobs,
            totalApplications,
            activeJobs,
            verifiedUsers,
            applicationsThisMonth,
            newUsersThisMonth,
            hiringRate,
            averageApplicationsPerJob,
        };
    }
    async getPerformanceMetrics(period) {
        const days = this.parsePeriod(period);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const datePoints = this.generateDatePoints(startDate, endDate);
        const userRegistrations = await Promise.all(datePoints.map(async (date) => ({
            date: date.toISOString().split('T')[0],
            value: await this.userRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)),
                },
            }),
        })));
        const jobPostings = await Promise.all(datePoints.map(async (date) => ({
            date: date.toISOString().split('T')[0],
            value: await this.jobRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)),
                },
            }),
        })));
        const applications = await Promise.all(datePoints.map(async (date) => ({
            date: date.toISOString().split('T')[0],
            value: await this.applicationRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)),
                },
            }),
        })));
        const successfulMatches = await Promise.all(datePoints.map(async (date) => ({
            date: date.toISOString().split('T')[0],
            value: await this.applicationRepository.count({
                where: {
                    status: application_entity_2.ApplicationStatus.ACCEPTED,
                    updatedAt: (0, typeorm_2.Between)(new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)),
                },
            }),
        })));
        return {
            userRegistrations,
            jobPostings,
            applications,
            successfulMatches,
            period,
        };
    }
    async getActivityFeed(limit) {
        const recentUsers = await this.userRepository.find({
            take: Math.ceil(limit * 0.4),
            order: { createdAt: 'DESC' },
            relations: ['applicantProfile', 'nonprofitProfile'],
        });
        const recentJobs = await this.jobRepository.find({
            take: Math.ceil(limit * 0.3),
            order: { createdAt: 'DESC' },
            relations: ['postedBy', 'postedBy.nonprofitProfile'],
        });
        const recentApplications = await this.applicationRepository.find({
            take: Math.ceil(limit * 0.3),
            order: { createdAt: 'DESC' },
            relations: ['applicant', 'applicant.applicantProfile', 'job'],
        });
        const activities = [];
        recentUsers.forEach((user) => {
            const name = user.role === role_enum_1.Role.APPLICANT && user.applicantProfile
                ? `${user.applicantProfile.firstName} ${user.applicantProfile.lastName}`.trim()
                : user.role === role_enum_1.Role.NONPROFIT && user.nonprofitProfile
                    ? user.nonprofitProfile.orgName
                    : 'Unknown User';
            activities.push({
                id: `user-${user.id}`,
                type: 'USER_REGISTERED',
                description: `${name} registered as ${user.role.toLowerCase()}`,
                user: {
                    id: user.id,
                    name,
                    email: user.email,
                },
                entityId: user.id,
                timestamp: user.createdAt,
                metadata: { role: user.role },
            });
        });
        recentJobs.forEach((job) => {
            const orgName = job.postedBy.nonprofitProfile?.orgName || 'Unknown Organization';
            activities.push({
                id: `job-${job.id}`,
                type: 'JOB_POSTED',
                description: `${orgName} posted a new job: ${job.title}`,
                entityId: job.id,
                timestamp: job.createdAt,
                metadata: { jobTitle: job.title, orgName },
            });
        });
        recentApplications.forEach((app) => {
            const applicantName = app.applicant.applicantProfile
                ? `${app.applicant.applicantProfile.firstName} ${app.applicant.applicantProfile.lastName}`.trim()
                : 'Unknown Applicant';
            activities.push({
                id: `app-${app.id}`,
                type: 'APPLICATION_SUBMITTED',
                description: `${applicantName} applied for ${app.job.title}`,
                entityId: app.id,
                timestamp: app.createdAt,
                metadata: {
                    jobTitle: app.job.title,
                    applicantName,
                    status: app.status,
                },
            });
        });
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const limitedActivities = activities.slice(0, limit);
        return {
            activities: limitedActivities,
            total: activities.length,
        };
    }
    async getRecommendations() {
        const recommendations = [];
        const pendingApplications = await this.applicationRepository.count({
            where: { status: application_entity_2.ApplicationStatus.PENDING },
        });
        if (pendingApplications > 0) {
            recommendations.push({
                id: 'pending-applications',
                type: 'PENDING_REVIEW',
                title: 'Applications Pending Review',
                description: `${pendingApplications} applications are waiting for review`,
                priority: 3,
                actionUrl: '/admin/applications?status=PENDING',
                createdAt: new Date(),
            });
        }
        const activeApplicants = await this.userRepository.count({
            where: { role: role_enum_1.Role.APPLICANT, isVerified: true },
        });
        const recentApplications = await this.applicationRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
            },
        });
        if (activeApplicants > recentApplications * 2) {
            recommendations.push({
                id: 'engagement-opportunity',
                type: 'ACTIVE_APPLICANTS',
                title: 'Low Application Activity',
                description: `${activeApplicants} active applicants with low recent application activity`,
                priority: 2,
                actionUrl: '/admin/job-seekers',
                createdAt: new Date(),
            });
        }
        const popularJobs = await this.jobRepository
            .createQueryBuilder('job')
            .leftJoin('job.applications', 'application')
            .select('job.id')
            .addSelect('job.title')
            .addSelect('COUNT(application.id)', 'applicationCount')
            .groupBy('job.id')
            .having('COUNT(application.id) > 10')
            .orderBy('COUNT(application.id)', 'DESC')
            .limit(5)
            .getRawMany();
        if (popularJobs.length > 0) {
            recommendations.push({
                id: 'popular-jobs',
                type: 'JOB_RECOMMENDATION',
                title: 'High-Demand Jobs',
                description: `${popularJobs.length} jobs have over 10 applications each`,
                priority: 4,
                entityIds: popularJobs.map(job => job.job_id),
                actionUrl: '/admin/ngos',
                createdAt: new Date(),
            });
        }
        const highPriorityCount = recommendations.filter(r => r.priority >= 4).length;
        return {
            recommendations,
            highPriorityCount,
        };
    }
    parsePeriod(period) {
        const match = period.match(/^(\d+)([dwmy])$/);
        if (!match)
            return 30;
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case 'd': return value;
            case 'w': return value * 7;
            case 'm': return value * 30;
            case 'y': return value * 365;
            default: return 30;
        }
    }
    generateDatePoints(startDate, endDate) {
        const points = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            points.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return points;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map