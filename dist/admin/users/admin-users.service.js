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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const applicant_entity_1 = require("../../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../../users/nonprofit/nonprofit.entity");
const application_entity_1 = require("../../jobs/entities/application.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const role_enum_1 = require("../../common/enums/role.enum");
let AdminUsersService = class AdminUsersService {
    userRepository;
    applicantRepository;
    nonprofitRepository;
    applicationRepository;
    jobRepository;
    constructor(userRepository, applicantRepository, nonprofitRepository, applicationRepository, jobRepository) {
        this.userRepository = userRepository;
        this.applicantRepository = applicantRepository;
        this.nonprofitRepository = nonprofitRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }
    async findAll(paginationDto, filters = {}) {
        const { page = 1, limit = 10 } = paginationDto;
        const { role, search } = filters;
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.applicantProfile', 'applicant')
            .leftJoinAndSelect('user.nonprofitProfile', 'nonprofit')
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.createdAt', 'DESC');
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        if (search) {
            queryBuilder.andWhere('(user.email ILIKE :search OR applicant.firstName ILIKE :search OR applicant.lastName ILIKE :search OR nonprofit.orgName ILIKE :search)', { search: `%${search}%` });
        }
        const [users, total] = await queryBuilder.getManyAndCount();
        const userData = await Promise.all(users.map(async (user) => this.transformUserToAdminDto(user)));
        return {
            data: userData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['applicantProfile', 'nonprofitProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.transformUserToAdminDto(user);
    }
    async update(id, updateUserStatusDto) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['applicantProfile', 'nonprofitProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, updateUserStatusDto);
        await this.userRepository.save(user);
        return this.transformUserToAdminDto(user);
    }
    async remove(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isVerified = false;
        await this.userRepository.save(user);
        return { message: 'User account suspended successfully' };
    }
    async getUserApplications(id, paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const [applications, total] = await this.applicationRepository.findAndCount({
            where: { applicantId: id },
            relations: ['job', 'job.postedBy', 'job.postedBy.nonprofitProfile'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: applications,
            total,
            page,
            limit,
        };
    }
    async transformUserToAdminDto(user) {
        const dto = {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        if (user.role === role_enum_1.Role.APPLICANT && user.applicantProfile) {
            const profile = user.applicantProfile;
            dto.firstName = profile.firstName;
            dto.lastName = profile.lastName;
            dto.photoUrl = profile.photoUrl;
            dto.city = profile.city;
            dto.country = profile.country;
            const applicationCount = await this.applicationRepository.count({
                where: { applicantId: user.id },
            });
            dto.applicationCount = applicationCount;
        }
        if (user.role === role_enum_1.Role.NONPROFIT && user.nonprofitProfile) {
            const profile = user.nonprofitProfile;
            dto.orgName = profile.orgName;
            dto.logoUrl = profile.logoUrl;
            dto.city = profile.city;
            dto.country = profile.country;
            const jobCount = await this.jobRepository.count({
                where: { postedById: user.id },
            });
            dto.jobCount = jobCount;
        }
        return dto;
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __param(3, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(4, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map