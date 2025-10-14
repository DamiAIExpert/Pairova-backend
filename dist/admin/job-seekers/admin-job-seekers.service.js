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
exports.AdminJobSeekersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const applicant_entity_1 = require("../../users/applicant/applicant.entity");
const application_entity_1 = require("../../jobs/entities/application.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const education_entity_1 = require("../../profiles/education/entities/education.entity");
const experience_entity_1 = require("../../profiles/experience/entities/experience.entity");
const certification_entity_1 = require("../../profiles/certifications/entities/certification.entity");
const role_enum_1 = require("../../common/enums/role.enum");
let AdminJobSeekersService = class AdminJobSeekersService {
    userRepository;
    applicantRepository;
    applicationRepository;
    jobRepository;
    educationRepository;
    experienceRepository;
    certificationRepository;
    constructor(userRepository, applicantRepository, applicationRepository, jobRepository, educationRepository, experienceRepository, certificationRepository) {
        this.userRepository = userRepository;
        this.applicantRepository = applicantRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.certificationRepository = certificationRepository;
    }
    async findAll(paginationDto, filters = {}) {
        const { page = 1, limit = 10 } = paginationDto;
        const { search } = filters;
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.applicantProfile', 'applicant')
            .where('user.role = :role', { role: role_enum_1.Role.APPLICANT })
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.createdAt', 'DESC');
        if (search) {
            queryBuilder.andWhere('(user.email ILIKE :search OR applicant.firstName ILIKE :search OR applicant.lastName ILIKE :search)', { search: `%${search}%` });
        }
        const [users, total] = await queryBuilder.getManyAndCount();
        const jobSeekerData = await Promise.all(users.map(async (user) => this.transformUserToJobSeekerDto(user)));
        return {
            data: jobSeekerData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.APPLICANT },
            relations: ['applicantProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        return this.transformUserToJobSeekerDto(user);
    }
    async update(id, updateJobSeekerDto) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.APPLICANT },
            relations: ['applicantProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        if (updateJobSeekerDto.isVerified !== undefined) {
            user.isVerified = updateJobSeekerDto.isVerified;
        }
        if (updateJobSeekerDto.phone) {
            user.phone = updateJobSeekerDto.phone;
        }
        await this.userRepository.save(user);
        if (user.applicantProfile) {
            const profile = user.applicantProfile;
            Object.assign(profile, {
                firstName: updateJobSeekerDto.firstName,
                lastName: updateJobSeekerDto.lastName,
                gender: updateJobSeekerDto.gender,
                dob: updateJobSeekerDto.dob ? new Date(updateJobSeekerDto.dob) : undefined,
                bio: updateJobSeekerDto.bio,
                country: updateJobSeekerDto.country,
                state: updateJobSeekerDto.state,
                city: updateJobSeekerDto.city,
                portfolioUrl: updateJobSeekerDto.portfolioUrl,
            });
            await this.applicantRepository.save(profile);
        }
        return this.transformUserToJobSeekerDto(user);
    }
    async remove(id) {
        const user = await this.userRepository.findOne({
            where: { id, role: role_enum_1.Role.APPLICANT },
        });
        if (!user) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        user.isVerified = false;
        await this.userRepository.save(user);
        return { message: 'Job seeker account suspended successfully' };
    }
    async getAppliedJobs(id, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [applications, total] = await this.applicationRepository.findAndCount({
            where: { applicantId: id },
            relations: ['job', 'job.postedBy', 'job.postedBy.nonprofitProfile'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const appliedJobsData = applications.map((app) => ({
            id: app.id,
            jobId: app.jobId,
            jobTitle: app.job.title,
            orgName: app.job.postedBy.nonprofitProfile?.orgName || 'Unknown Organization',
            status: app.status,
            appliedAt: app.createdAt,
            matchScore: undefined,
        }));
        return {
            data: appliedJobsData,
            total,
            page,
            limit,
        };
    }
    async getEducation(id) {
        return this.educationRepository.find({
            where: { applicantId: id },
            order: { endDate: 'DESC' },
        });
    }
    async getExperience(id) {
        return this.experienceRepository.find({
            where: { applicantId: id },
            order: { endDate: 'DESC' },
        });
    }
    async getCertifications(id) {
        return this.certificationRepository.find({
            where: { applicantId: id },
            order: { issuedDate: 'DESC' },
        });
    }
    async transformUserToJobSeekerDto(user) {
        const profile = user.applicantProfile;
        const dto = {
            id: user.id,
            email: user.email,
            isVerified: user.isVerified,
            phone: user.phone,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            name: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Unknown',
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            gender: profile?.gender,
            dob: profile?.dob,
            bio: profile?.bio,
            country: profile?.country,
            state: profile?.state,
            city: profile?.city,
            photoUrl: profile?.photoUrl,
            portfolioUrl: profile?.portfolioUrl,
            applicationCount: 0,
            applicationDate: undefined,
            currentStatus: undefined,
        };
        const applications = await this.applicationRepository.find({
            where: { applicantId: user.id },
            order: { createdAt: 'DESC' },
        });
        dto.applicationCount = applications.length;
        if (applications.length > 0) {
            dto.applicationDate = applications[0].createdAt.toISOString().split('T')[0];
            dto.currentStatus = applications[0].status;
        }
        return dto;
    }
};
exports.AdminJobSeekersService = AdminJobSeekersService;
exports.AdminJobSeekersService = AdminJobSeekersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(4, (0, typeorm_1.InjectRepository)(education_entity_1.Education)),
    __param(5, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(6, (0, typeorm_1.InjectRepository)(certification_entity_1.Certification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminJobSeekersService);
//# sourceMappingURL=admin-job-seekers.service.js.map