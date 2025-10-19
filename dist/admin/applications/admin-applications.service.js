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
exports.AdminApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../../jobs/entities/application.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const applicant_entity_1 = require("../../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../../users/nonprofit/nonprofit.entity");
const application_entity_2 = require("../../jobs/entities/application.entity");
let AdminApplicationsService = class AdminApplicationsService {
    applicationRepository;
    jobRepository;
    userRepository;
    applicantRepository;
    nonprofitRepository;
    constructor(applicationRepository, jobRepository, userRepository, applicantRepository, nonprofitRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicantRepository = applicantRepository;
        this.nonprofitRepository = nonprofitRepository;
    }
    async findAll(paginationDto, filters = {}) {
        const { page = 1, limit = 10 } = paginationDto;
        const { status, jobId, applicantId, ngoId, search } = filters;
        const queryBuilder = this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('application.job', 'job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('applicant.applicantProfile', 'applicantProfile')
            .leftJoinAndSelect('postedBy.nonprofitProfile', 'nonprofitProfile')
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('application.createdAt', 'DESC');
        if (status) {
            queryBuilder.andWhere('application.status = :status', { status });
        }
        if (jobId) {
            queryBuilder.andWhere('application.jobId = :jobId', { jobId });
        }
        if (applicantId) {
            queryBuilder.andWhere('application.applicantId = :applicantId', { applicantId });
        }
        if (ngoId) {
            queryBuilder.andWhere('job.postedById = :ngoId', { ngoId });
        }
        if (search) {
            queryBuilder.andWhere('(job.title ILIKE :search OR applicantProfile.firstName ILIKE :search OR applicantProfile.lastName ILIKE :search OR nonprofitProfile.orgName ILIKE :search)', { search: `%${search}%` });
        }
        const [applications, total] = await queryBuilder.getManyAndCount();
        const applicationData = applications.map((app) => this.transformToDto(app));
        return {
            data: applicationData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: [
                'applicant',
                'applicant.applicantProfile',
                'job',
                'job.postedBy',
                'job.postedBy.nonprofitProfile',
            ],
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return this.transformToDto(application);
    }
    async updateStatus(id, updateApplicationStatusDto) {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: [
                'applicant',
                'applicant.applicantProfile',
                'job',
                'job.postedBy',
                'job.postedBy.nonprofitProfile',
            ],
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        application.status = updateApplicationStatusDto.status;
        if (updateApplicationStatusDto.notes) {
        }
        const savedApplication = await this.applicationRepository.save(application);
        return this.transformToDto(savedApplication);
    }
    async getPipeline(ngoId) {
        let queryBuilder = this.applicationRepository.createQueryBuilder('application');
        if (ngoId) {
            queryBuilder = queryBuilder
                .leftJoin('application.job', 'job')
                .where('job.postedById = :ngoId', { ngoId });
        }
        const [applications, total] = await queryBuilder.getManyAndCount();
        const statusCounts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        const hiredApplications = statusCounts[application_entity_2.ApplicationStatus.ACCEPTED] || 0;
        const hiringRate = total > 0 ? (hiredApplications / total) * 100 : 0;
        const hiredApps = applications.filter(app => app.status === application_entity_2.ApplicationStatus.ACCEPTED);
        const averageTimeToHire = hiredApps.length > 0
            ? hiredApps.reduce((sum, app) => {
                const timeToHire = (app.updatedAt.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                return sum + timeToHire;
            }, 0) / hiredApps.length
            : undefined;
        return {
            pending: statusCounts[application_entity_2.ApplicationStatus.PENDING] || 0,
            underReview: statusCounts[application_entity_2.ApplicationStatus.REVIEWED] || 0,
            interview: statusCounts[application_entity_2.ApplicationStatus.INTERVIEWED] || 0,
            hired: hiredApplications,
            denied: statusCounts[application_entity_2.ApplicationStatus.REJECTED] || 0,
            withdrawn: 0,
            total,
            hiringRate,
            averageTimeToHire,
        };
    }
    async getStatistics(ngoId) {
        let queryBuilder = this.applicationRepository.createQueryBuilder('application');
        if (ngoId) {
            queryBuilder = queryBuilder
                .leftJoin('application.job', 'job')
                .where('job.postedById = :ngoId', { ngoId });
        }
        const applications = await queryBuilder.getMany();
        const totalApplications = applications.length;
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const applicationsThisMonth = applications.filter(app => app.createdAt >= startOfMonth).length;
        const applicationsByStatus = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        const uniqueJobs = new Set(applications.map(app => app.jobId)).size;
        const averageApplicationsPerJob = uniqueJobs > 0 ? totalApplications / uniqueJobs : 0;
        const jobApplicationCounts = applications.reduce((acc, app) => {
            const jobId = app.jobId;
            if (!acc[jobId]) {
                acc[jobId] = {
                    jobId,
                    applicationCount: 0,
                    jobTitle: '',
                    ngoName: '',
                };
            }
            acc[jobId].applicationCount++;
            return acc;
        }, {});
        const topJobIds = Object.keys(jobApplicationCounts)
            .sort((a, b) => jobApplicationCounts[b].applicationCount - jobApplicationCounts[a].applicationCount)
            .slice(0, 5);
        const topJobs = await Promise.all(topJobIds.map(async (jobId) => {
            const job = await this.jobRepository.findOne({
                where: { id: jobId },
                relations: ['postedBy', 'postedBy.nonprofitProfile'],
            });
            return {
                jobId,
                jobTitle: job?.title || 'Unknown Job',
                ngoName: job?.postedBy.nonprofitProfile?.orgName || 'Unknown NGO',
                applicationCount: jobApplicationCounts[jobId].applicationCount,
            };
        }));
        const hiredApplications = applicationsByStatus[application_entity_2.ApplicationStatus.ACCEPTED] || 0;
        const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
        const hiredApps = applications.filter(app => app.status === application_entity_2.ApplicationStatus.ACCEPTED);
        const averageTimeToHire = hiredApps.length > 0
            ? hiredApps.reduce((sum, app) => {
                const timeToHire = (app.updatedAt.getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                return sum + timeToHire;
            }, 0) / hiredApps.length
            : undefined;
        return {
            totalApplications,
            applicationsThisMonth,
            applicationsByStatus,
            averageApplicationsPerJob,
            topJobs,
            hiringRate,
            averageTimeToHire,
        };
    }
    transformToDto(application) {
        const applicant = application.applicant;
        const applicantProfile = applicant.applicantProfile;
        const job = application.job;
        const postedBy = job.postedBy;
        const nonprofitProfile = postedBy.nonprofitProfile;
        const applicantName = applicantProfile
            ? `${applicantProfile.firstName || ''} ${applicantProfile.lastName || ''}`.trim()
            : 'Unknown Applicant';
        const applicantLocation = applicantProfile
            ? [applicantProfile.city, applicantProfile.state, applicantProfile.country]
                .filter(Boolean)
                .join(', ')
            : undefined;
        const ngoLocation = nonprofitProfile
            ? [nonprofitProfile.city, nonprofitProfile.state, nonprofitProfile.country]
                .filter(Boolean)
                .join(', ')
            : undefined;
        const daysSinceApplication = Math.floor((Date.now() - application.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return {
            id: application.id,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            coverLetter: application.coverLetter,
            resumeUrl: application.resumeUrl,
            applicantId: application.applicantId,
            applicantName,
            applicantEmail: applicant.email,
            applicantPhotoUrl: applicantProfile?.photoUrl,
            applicantPhone: applicant.phone,
            applicantLocation,
            jobId: application.jobId,
            jobTitle: job.title,
            jobDescription: job.description,
            employmentType: job.employmentType,
            placement: job.placement,
            ngoId: job.postedById,
            ngoName: nonprofitProfile?.orgName || 'Unknown Organization',
            ngoLogoUrl: nonprofitProfile?.logoUrl,
            ngoLocation,
            matchScore: undefined,
            daysSinceApplication,
        };
    }
};
exports.AdminApplicationsService = AdminApplicationsService;
exports.AdminApplicationsService = AdminApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminApplicationsService);
//# sourceMappingURL=admin-applications.service.js.map