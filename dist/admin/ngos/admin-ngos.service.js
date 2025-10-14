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
exports.AdminNgosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const nonprofit_entity_1 = require("../../users/nonprofit/nonprofit.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const application_entity_1 = require("../../jobs/entities/application.entity");
const role_enum_1 = require("../../common/enums/role.enum");
const job_entity_2 = require("../../jobs/entities/job.entity");
const application_entity_2 = require("../../jobs/entities/application.entity");
let AdminNgosService = class AdminNgosService {
    userRepository;
    nonprofitRepository;
    jobRepository;
    applicationRepository;
    constructor(userRepository, nonprofitRepository, jobRepository, applicationRepository) {
        this.userRepository = userRepository;
        this.nonprofitRepository = nonprofitRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }
    async findAll(paginationDto, filters = {}) {
        const { page = 1, limit = 10 } = paginationDto;
        const { search } = filters;
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.nonprofitProfile', 'nonprofit')
            .where('user.role = :role', { role: role_enum_1.Role.NONPROFIT })
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.createdAt', 'DESC');
        if (search) {
            queryBuilder.andWhere('(user.email ILIKE :search OR nonprofit.orgName ILIKE :search OR nonprofit.industry ILIKE :search)', { search: `%${search}%` });
        }
        const [users, total] = await queryBuilder.getManyAndCount();
        const ngoData = await Promise.all(users.map(async (user) => this.transformUserToNgoDto(user)));
        return {
            data: ngoData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.NONPROFIT },
            relations: ['nonprofitProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('NGO not found');
        }
        return this.transformUserToNgoDto(user);
    }
    async update(id, updateNgoDto) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.NONPROFIT },
            relations: ['nonprofitProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('NGO not found');
        }
        if (updateNgoDto.isVerified !== undefined) {
            user.isVerified = updateNgoDto.isVerified;
        }
        if (updateNgoDto.phone) {
            user.phone = updateNgoDto.phone;
        }
        await this.userRepository.save(user);
        if (user.nonprofitProfile) {
            const profile = user.nonprofitProfile;
            Object.assign(profile, {
                orgName: updateNgoDto.orgName,
                website: updateNgoDto.website,
                mission: updateNgoDto.mission,
                values: updateNgoDto.values,
                sizeLabel: updateNgoDto.sizeLabel,
                orgType: updateNgoDto.orgType,
                industry: updateNgoDto.industry,
                foundedOn: updateNgoDto.foundedOn ? new Date(updateNgoDto.foundedOn) : undefined,
                taxId: updateNgoDto.taxId,
                country: updateNgoDto.country,
                state: updateNgoDto.state,
                city: updateNgoDto.city,
                addressLine1: updateNgoDto.addressLine1,
                addressLine2: updateNgoDto.addressLine2,
            });
            await this.nonprofitRepository.save(profile);
        }
        return this.transformUserToNgoDto(user);
    }
    async remove(id) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.NONPROFIT },
        });
        if (!user) {
            throw new common_1.NotFoundException('NGO not found');
        }
        user.isVerified = false;
        await this.userRepository.save(user);
        return { message: 'NGO account suspended successfully' };
    }
    async getJobs(id, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [jobs, total] = await this.jobRepository.findAndCount({
            where: { postedById: id },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const jobData = await Promise.all(jobs.map(async (job) => {
            const applicationCount = await this.applicationRepository.count({
                where: { jobId: job.id },
            });
            return {
                id: job.id,
                title: job.title,
                description: job.description,
                employmentType: job.employmentType,
                placement: job.placement,
                status: job.status,
                postedAt: job.createdAt,
                applicationCount,
            };
        }));
        return {
            data: jobData,
            total,
            page,
            limit,
        };
    }
    async getJobApplicants(ngoId, jobId, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const job = await this.jobRepository.findOne({
            where: { id: jobId, postedById: ngoId },
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found for this NGO');
        }
        const [applications, total] = await this.applicationRepository.findAndCount({
            where: { jobId },
            relations: ['applicant', 'applicant.applicantProfile'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const applicantData = applications.map((app) => ({
            applicationId: app.id,
            applicantId: app.applicantId,
            applicantName: app.applicant.applicantProfile
                ? `${app.applicant.applicantProfile.firstName || ''} ${app.applicant.applicantProfile.lastName || ''}`.trim()
                : 'Unknown',
            applicantEmail: app.applicant.email,
            status: app.status,
            appliedAt: app.createdAt,
            matchScore: undefined,
            photoUrl: app.applicant.applicantProfile?.photoUrl,
        }));
        return {
            data: applicantData,
            total,
            page,
            limit,
        };
    }
    async getStatistics(id) {
        const ngo = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.NONPROFIT },
        });
        if (!ngo) {
            throw new common_1.NotFoundException('NGO not found');
        }
        const totalJobs = await this.jobRepository.count({
            where: { postedById: id },
        });
        const activeJobs = await this.jobRepository.count({
            where: { postedById: id, status: job_entity_2.JobStatus.PUBLISHED },
        });
        const applications = await this.applicationRepository
            .createQueryBuilder('app')
            .leftJoin('app.job', 'job')
            .where('job.postedById = :ngoId', { ngoId: id })
            .getMany();
        const totalApplications = applications.length;
        const applicationsByStatus = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        const jobs = await this.jobRepository.find({
            where: { postedById: id },
        });
        const jobsByStatus = jobs.reduce((acc, job) => {
            acc[job.status] = (acc[job.status] || 0) + 1;
            return acc;
        }, {});
        const averageApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
        const hiredApplications = applicationsByStatus[application_entity_2.ApplicationStatus.HIRED] || 0;
        const hiringRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
        return {
            totalJobs,
            activeJobs,
            totalApplications,
            applicationsByStatus,
            jobsByStatus,
            averageApplicationsPerJob,
            hiringRate,
        };
    }
    async transformUserToNgoDto(user) {
        const profile = user.nonprofitProfile;
        const dto = {
            id: user.id,
            email: user.email,
            isVerified: user.isVerified,
            phone: user.phone,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            orgName: profile?.orgName || 'Unknown Organization',
            logoUrl: profile?.logoUrl,
            website: profile?.website,
            mission: profile?.mission,
            values: profile?.values,
            sizeLabel: profile?.sizeLabel,
            orgType: profile?.orgType,
            industry: profile?.industry,
            foundedOn: profile?.foundedOn,
            taxId: profile?.taxId,
            country: profile?.country,
            state: profile?.state,
            city: profile?.city,
            addressLine1: profile?.addressLine1,
            addressLine2: profile?.addressLine2,
            jobCount: 0,
            applicationCount: 0,
            activeJobCount: 0,
        };
        const totalJobs = await this.jobRepository.count({
            where: { postedById: user.id },
        });
        const activeJobs = await this.jobRepository.count({
            where: { postedById: user.id, status: job_entity_2.JobStatus.PUBLISHED },
        });
        const totalApplications = await this.applicationRepository
            .createQueryBuilder('app')
            .leftJoin('app.job', 'job')
            .where('job.postedById = :ngoId', { ngoId: user.id })
            .getCount();
        dto.jobCount = totalJobs;
        dto.activeJobCount = activeJobs;
        dto.applicationCount = totalApplications;
        return dto;
    }
};
exports.AdminNgosService = AdminNgosService;
exports.AdminNgosService = AdminNgosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __param(2, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(3, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminNgosService);
//# sourceMappingURL=admin-ngos.service.js.map