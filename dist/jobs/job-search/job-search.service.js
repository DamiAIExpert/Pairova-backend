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
exports.JobSearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../entities/job.entity");
const application_entity_1 = require("../entities/application.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const applicant_entity_1 = require("../../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../../users/nonprofit/nonprofit.entity");
const saved_jobs_service_1 = require("../saved-jobs/saved-jobs.service");
const job_entity_2 = require("../entities/job.entity");
const role_enum_1 = require("../../common/enums/role.enum");
let JobSearchService = class JobSearchService {
    jobRepository;
    applicationRepository;
    userRepository;
    applicantRepository;
    nonprofitRepository;
    savedJobsService;
    constructor(jobRepository, applicationRepository, userRepository, applicantRepository, nonprofitRepository, savedJobsService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.applicantRepository = applicantRepository;
        this.nonprofitRepository = nonprofitRepository;
        this.savedJobsService = savedJobsService;
    }
    async searchJobs(paginationDto, filters) {
        const { page = 1, limit = 10 } = paginationDto;
        const startTime = Date.now();
        const queryBuilder = this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
            .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .skip((page - 1) * limit)
            .take(limit);
        if (filters.search) {
            queryBuilder.andWhere('(job.title ILIKE :search OR job.description ILIKE :search OR nonprofitProfile.orgName ILIKE :search)', { search: `%${filters.search}%` });
        }
        if (filters.location) {
            queryBuilder.andWhere('(nonprofitProfile.city ILIKE :location OR nonprofitProfile.state ILIKE :location OR nonprofitProfile.country ILIKE :location)', { location: `%${filters.location}%` });
        }
        if (filters.employmentType) {
            queryBuilder.andWhere('job.employmentType = :employmentType', {
                employmentType: filters.employmentType
            });
        }
        if (filters.placement) {
            queryBuilder.andWhere('job.placement = :placement', {
                placement: filters.placement
            });
        }
        if (filters.salaryMin !== undefined) {
            queryBuilder.andWhere('job.salaryMin >= :salaryMin', {
                salaryMin: filters.salaryMin
            });
        }
        if (filters.salaryMax !== undefined) {
            queryBuilder.andWhere('job.salaryMax <= :salaryMax', {
                salaryMax: filters.salaryMax
            });
        }
        if (filters.experienceLevel) {
            queryBuilder.andWhere('job.experienceLevel = :experienceLevel', {
                experienceLevel: filters.experienceLevel
            });
        }
        if (filters.ngoId) {
            queryBuilder.andWhere('job.postedById = :ngoId', { ngoId: filters.ngoId });
        }
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder || 'DESC';
        queryBuilder.orderBy(`job.${sortBy}`, sortOrder);
        const [jobs, total] = await queryBuilder.getManyAndCount();
        const jobResults = await Promise.all(jobs.map(async (job) => this.transformToSearchResult(job)));
        const searchTime = Date.now() - startTime;
        const totalPages = Math.ceil(total / limit);
        return {
            jobs: jobResults,
            total,
            page,
            limit,
            query: filters.search || '',
            filters,
            metadata: {
                searchTime,
                hasMore: page < totalPages,
                totalPages,
            },
        };
    }
    async getRecommendedJobs(user, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        if (user.role !== role_enum_1.Role.APPLICANT) {
            throw new Error('Only applicants can receive job recommendations');
        }
        const applicantProfile = await this.applicantRepository.findOne({
            where: { userId: user.id },
        });
        if (!applicantProfile) {
            return {
                jobs: [],
                total: 0,
                page,
                limit,
                query: '',
                filters: {},
                metadata: {
                    searchTime: 0,
                    hasMore: false,
                    totalPages: 0,
                },
            };
        }
        const appliedJobIds = await this.applicationRepository
            .createQueryBuilder('application')
            .select('application.jobId')
            .where('application.applicantId = :applicantId', { applicantId: user.id })
            .getRawMany()
            .then(results => results.map(r => r.application_jobId));
        const queryBuilder = this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
            .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .skip((page - 1) * limit)
            .take(limit);
        if (appliedJobIds.length > 0) {
            queryBuilder.andWhere('job.id NOT IN (:...appliedJobIds)', { appliedJobIds });
        }
        if (applicantProfile.city) {
            queryBuilder.orWhere('nonprofitProfile.city = :city', {
                city: applicantProfile.city
            });
        }
        if (applicantProfile.preferredEmploymentType) {
            queryBuilder.orWhere('job.employmentType = :employmentType', {
                employmentType: applicantProfile.preferredEmploymentType
            });
        }
        queryBuilder.orderBy('job.createdAt', 'DESC');
        const [jobs, total] = await queryBuilder.getManyAndCount();
        const jobResults = await Promise.all(jobs.map(async (job) => {
            const result = await this.transformToSearchResult(job);
            result.matchScore = this.calculateMatchScore(job, applicantProfile);
            return result;
        }));
        jobResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        return {
            jobs: jobResults,
            total,
            page,
            limit,
            query: '',
            filters: {},
            metadata: {
                searchTime: 0,
                hasMore: page < Math.ceil(total / limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getTrendingJobs(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const trendingJobs = await this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
            .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .andWhere('job.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
            .orderBy('job.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const total = await this.jobRepository
            .createQueryBuilder('job')
            .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .andWhere('job.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
            .getCount();
        const jobResults = await Promise.all(trendingJobs.map(async (job) => this.transformToSearchResult(job)));
        return {
            jobs: jobResults,
            total,
            page,
            limit,
            query: '',
            filters: {},
            metadata: {
                searchTime: 0,
                hasMore: page < Math.ceil(total / limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSearchFilters() {
        const [employmentTypes, placements, locations, experienceLevels, organizations, skills,] = await Promise.all([
            this.jobRepository
                .createQueryBuilder('job')
                .select('DISTINCT job.employmentType', 'employmentType')
                .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
                .getRawMany(),
            this.jobRepository
                .createQueryBuilder('job')
                .select('DISTINCT job.placement', 'placement')
                .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
                .getRawMany(),
            this.nonprofitRepository
                .createQueryBuilder('nonprofit')
                .select('DISTINCT CONCAT(nonprofit.city, \', \', nonprofit.state, \', \', nonprofit.country)', 'location')
                .where('nonprofit.city IS NOT NULL')
                .getRawMany(),
            this.jobRepository
                .createQueryBuilder('job')
                .select('DISTINCT job.experienceLevel', 'experienceLevel')
                .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
                .andWhere('job.experienceLevel IS NOT NULL')
                .getRawMany(),
            this.nonprofitRepository
                .createQueryBuilder('nonprofit')
                .select('nonprofit.userId', 'id')
                .addSelect('nonprofit.orgName', 'name')
                .addSelect('CONCAT(nonprofit.city, \', \', nonprofit.country)', 'location')
                .getRawMany(),
            this.jobRepository
                .createQueryBuilder('job')
                .select('DISTINCT UNNEST(job.requiredSkills)', 'skill')
                .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
                .getRawMany(),
        ]);
        const salaryRanges = [
            { label: 'Under $500', min: 0, max: 500 },
            { label: '$500 - $1,000', min: 500, max: 1000 },
            { label: '$1,000 - $2,500', min: 1000, max: 2500 },
            { label: '$2,500 - $5,000', min: 2500, max: 5000 },
            { label: 'Over $5,000', min: 5000, max: 999999 },
        ];
        return {
            employmentTypes: employmentTypes.map(item => item.employmentType),
            placements: placements.map(item => item.placement),
            locations: locations.map(item => item.location),
            experienceLevels: experienceLevels.map(item => item.experienceLevel),
            organizations: organizations.map(item => ({
                id: item.id,
                name: item.name,
                location: item.location,
            })),
            skills: skills.map(item => item.skill),
            salaryRanges,
        };
    }
    async getSimilarJobs(jobId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const referenceJob = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['postedBy', 'postedBy.nonprofitOrg'],
        });
        if (!referenceJob) {
            throw new Error('Job not found');
        }
        const similarJobs = await this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
            .where('job.id != :jobId', { jobId })
            .andWhere('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .andWhere('(job.employmentType = :employmentType OR job.placement = :placement OR nonprofitProfile.city = :city)', {
            employmentType: referenceJob.employmentType,
            placement: referenceJob.placement,
            city: referenceJob.postedBy.nonprofitProfile?.city,
        })
            .orderBy('job.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const total = await this.jobRepository
            .createQueryBuilder('job')
            .where('job.id != :jobId', { jobId })
            .andWhere('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .getCount();
        const jobResults = await Promise.all(similarJobs.map(async (job) => this.transformToSearchResult(job)));
        return {
            jobs: jobResults,
            total,
            page,
            limit,
            query: '',
            filters: {},
            metadata: {
                searchTime: 0,
                hasMore: page < Math.ceil(total / limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getNearbyJobs(paginationDto, location) {
        const { page = 1, limit = 10 } = paginationDto;
        const { latitude, longitude, radius = 50 } = location;
        const nearbyJobs = await this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.nonprofitOrg', 'nonprofitProfile')
            .where('job.status = :status', { status: job_entity_2.JobStatus.PUBLISHED })
            .andWhere('nonprofitProfile.latitude IS NOT NULL')
            .andWhere('nonprofitProfile.longitude IS NOT NULL')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const filteredJobs = nearbyJobs.filter(job => {
            const orgProfile = job.postedBy.nonprofitProfile;
            if (!orgProfile?.latitude || !orgProfile?.longitude)
                return false;
            const distance = this.calculateDistance(latitude, longitude, orgProfile.latitude, orgProfile.longitude);
            return distance <= radius;
        });
        const jobResults = await Promise.all(filteredJobs.map(async (job) => this.transformToSearchResult(job)));
        return {
            jobs: jobResults,
            total: filteredJobs.length,
            page,
            limit,
            query: '',
            filters: {},
            metadata: {
                searchTime: 0,
                hasMore: page < Math.ceil(filteredJobs.length / limit),
                totalPages: Math.ceil(filteredJobs.length / limit),
            },
        };
    }
    async transformToSearchResult(job) {
        const orgProfile = job.postedBy.nonprofitProfile;
        const applicantCount = await this.applicationRepository.count({
            where: { jobId: job.id },
        });
        const daysSincePosted = Math.floor((Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return {
            id: job.id,
            title: job.title,
            description: job.description.substring(0, 200) + '...',
            employmentType: job.employmentType,
            placement: job.placement,
            status: job.status,
            postedAt: job.createdAt,
            deadline: job.deadline,
            salaryRange: job.salaryMin && job.salaryMax ? {
                min: job.salaryMin,
                max: job.salaryMax,
                currency: 'USD',
            } : undefined,
            experienceLevel: job.experienceLevel,
            requiredSkills: job.requiredSkills || [],
            benefits: job.benefits || [],
            ngoId: job.postedById,
            orgName: orgProfile?.orgName || 'Unknown Organization',
            orgLogoUrl: orgProfile?.logoUrl,
            orgLocation: [
                orgProfile?.city,
                orgProfile?.state,
                orgProfile?.country,
            ].filter(Boolean).join(', '),
            orgSize: orgProfile?.sizeLabel,
            applicantCount,
            daysSincePosted,
            isBookmarked: false,
            matchScore: undefined,
            applicationStatus: undefined,
        };
    }
    calculateMatchScore(job, profile) {
        let score = 0;
        if (profile.city && job.postedBy.nonprofitProfile?.city === profile.city) {
            score += 40;
        }
        else if (profile.state && job.postedBy.nonprofitProfile?.state === profile.state) {
            score += 20;
        }
        else if (profile.country && job.postedBy.nonprofitProfile?.country === profile.country) {
            score += 10;
        }
        if (profile.preferredEmploymentType === job.employmentType) {
            score += 30;
        }
        if (profile.skills && job.requiredSkills) {
            const matchingSkills = profile.skills.filter(skill => job.requiredSkills.includes(skill));
            const skillMatchPercentage = matchingSkills.length / job.requiredSkills.length;
            score += skillMatchPercentage * 20;
        }
        if (profile.experienceLevel === job.experienceLevel) {
            score += 10;
        }
        return Math.round(score);
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
                Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    async searchJobsForApplicant(user, searchParams) {
        const { page = 1, limit = 20, ...filters } = searchParams;
        const result = await this.searchJobs({ page, limit }, filters);
        return {
            jobs: result.jobs,
            total: result.total,
            page: result.page,
            limit: result.limit,
            filters: result.filters,
        };
    }
    async getRecommendedJobsForApplicant(user, limit = 10) {
        const result = await this.getRecommendedJobs(user, { page: 1, limit });
        return {
            jobs: result.jobs,
            total: result.total,
        };
    }
    async getSavedJobsForApplicant(user, page = 1, limit = 20) {
        return this.savedJobsService.getSavedJobs(user.id, page, limit);
    }
    async saveJobForApplicant(user, jobId) {
        await this.savedJobsService.saveJob(user.id, jobId);
    }
    async unsaveJobForApplicant(user, jobId) {
        await this.savedJobsService.unsaveJob(user.id, jobId);
    }
};
exports.JobSearchService = JobSearchService;
exports.JobSearchService = JobSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        saved_jobs_service_1.SavedJobsService])
], JobSearchService);
//# sourceMappingURL=job-search.service.js.map