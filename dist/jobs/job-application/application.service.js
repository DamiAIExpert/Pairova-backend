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
var ApplicationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
const role_enum_1 = require("../../common/enums/role.enum");
const jobs_service_1 = require("../jobs.service");
const job_enum_1 = require("../../common/enums/job.enum");
let ApplicationsService = ApplicationsService_1 = class ApplicationsService {
    applicationRepository;
    jobsService;
    logger = new common_1.Logger(ApplicationsService_1.name);
    constructor(applicationRepository, jobsService) {
        this.applicationRepository = applicationRepository;
        this.jobsService = jobsService;
    }
    async apply(createApplicationDto, currentUser) {
        if (currentUser.role !== role_enum_1.Role.APPLICANT) {
            throw new common_1.ForbiddenException('Only applicants can apply for jobs.');
        }
        await this.jobsService.findOne(createApplicationDto.jobId);
        const existingApplication = await this.applicationRepository.findOne({
            where: {
                jobId: createApplicationDto.jobId,
                applicantId: currentUser.id
            }
        });
        if (existingApplication) {
            throw new common_1.ConflictException('You have already applied for this job.');
        }
        const application = this.applicationRepository.create({
            ...createApplicationDto,
            applicantId: currentUser.id,
        });
        return this.applicationRepository.save(application);
    }
    async applyComprehensive(createComprehensiveDto, currentUser) {
        if (currentUser.role !== role_enum_1.Role.APPLICANT) {
            throw new common_1.ForbiddenException('Only applicants can apply for jobs.');
        }
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(createComprehensiveDto.jobId);
        if (isUUID) {
            await this.jobsService.findOne(createComprehensiveDto.jobId);
        }
        else {
            this.logger.log(`Demo job application for jobId: ${createComprehensiveDto.jobId}`);
        }
        const existingApplication = await this.applicationRepository.findOne({
            where: {
                jobId: createComprehensiveDto.jobId,
                applicantId: currentUser.id,
            },
        });
        if (existingApplication) {
            throw new common_1.ConflictException('You have already applied for this job.');
        }
        const { jobId, coverLetter, resumeUploadId, ...comprehensiveData } = createComprehensiveDto;
        const application = this.applicationRepository.create({
            jobId,
            coverLetter,
            resumeUploadId,
            applicantId: currentUser.id,
            applicationData: comprehensiveData,
        });
        return this.applicationRepository.save(application);
    }
    async findAllForUser(user) {
        if (user.role === role_enum_1.Role.APPLICANT) {
            return this.applicationRepository.find({
                where: { applicantId: user.id },
                relations: [
                    'job',
                    'job.postedBy',
                    'job.postedBy.nonprofitProfile',
                    'applicant',
                    'applicant.applicantProfile'
                ],
                order: { appliedAt: 'DESC' },
            });
        }
        return [];
    }
    async findOne(id, user) {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: ['job', 'applicant', 'applicant.applicantProfile']
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID "${id}" not found.`);
        }
        if (user.role === role_enum_1.Role.APPLICANT && application.applicantId !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to view this application.');
        }
        if (user.role === role_enum_1.Role.NONPROFIT && application.job.orgUserId !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to view this application.');
        }
        return application;
    }
    async updateStatus(id, status, notes, user) {
        const application = await this.findOne(id, user);
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can update application status.');
        }
        if (application.job.orgUserId !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to update this application.');
        }
        application.status = status;
        if (notes) {
            application.notes = notes;
        }
        return this.applicationRepository.save(application);
    }
    async remove(id) {
        const result = await this.applicationRepository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException(`Application with ID "${id}" not found.`);
        }
    }
    async getApplicationsByOrganization(user, filters = {}, page = 1, limit = 20) {
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can access this resource.');
        }
        const queryBuilder = this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.applicant', 'applicant')
            .leftJoinAndSelect('applicant.applicantProfile', 'applicantProfile')
            .leftJoinAndSelect('application.job', 'job')
            .leftJoinAndSelect('application.resume', 'resume')
            .where('job.orgUserId = :userId', { userId: user.id })
            .orderBy('application.appliedAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (filters.status) {
            queryBuilder.andWhere('application.status = :status', { status: filters.status });
        }
        if (filters.jobId) {
            queryBuilder.andWhere('application.jobId = :jobId', { jobId: filters.jobId });
        }
        const [applications, total] = await queryBuilder.getManyAndCount();
        return {
            applications,
            total,
            page,
            limit,
        };
    }
    async getApplicationStatistics(user) {
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can access this resource.');
        }
        const baseQuery = this.applicationRepository
            .createQueryBuilder('application')
            .leftJoin('application.job', 'job')
            .where('job.orgUserId = :userId', { userId: user.id });
        const totalApplications = await baseQuery.getCount();
        const pendingApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.PENDING })
            .getCount();
        const reviewedApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.REVIEWED })
            .getCount();
        const shortlistedApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.SHORTLISTED })
            .getCount();
        const interviewedApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.INTERVIEWED })
            .getCount();
        const acceptedApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.ACCEPTED })
            .getCount();
        const rejectedApplications = await baseQuery
            .clone()
            .andWhere('application.status = :status', { status: job_enum_1.ApplicationStatus.REJECTED })
            .getCount();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const applicationsThisMonth = await baseQuery
            .clone()
            .andWhere('application.appliedAt >= :startOfMonth', { startOfMonth })
            .getCount();
        return {
            totalApplications,
            pendingApplications,
            reviewedApplications,
            shortlistedApplications,
            interviewedApplications,
            acceptedApplications,
            rejectedApplications,
            applicationsThisMonth,
        };
    }
    async getApplicationByOrganization(applicationId, user) {
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can access this resource.');
        }
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['applicant', 'applicant.applicantProfile', 'job', 'resume'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID "${applicationId}" not found.`);
        }
        if (application.job.orgUserId !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to view this application.');
        }
        return application;
    }
    async updateApplicationStatusByOrganization(applicationId, user, updateData) {
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can update applications.');
        }
        const application = await this.getApplicationByOrganization(applicationId, user);
        application.status = updateData.status;
        if (updateData.notes) {
            application.notes = updateData.notes;
        }
        if (updateData.interviewDate || updateData.rejectionReason) {
            application.applicationData = {
                ...application.applicationData,
                interviewDate: updateData.interviewDate,
                rejectionReason: updateData.rejectionReason,
            };
        }
        await this.applicationRepository.save(application);
        return { message: 'Application status updated successfully' };
    }
    async bulkUpdateApplicationStatusByOrganization(user, applicationIds, status, notes) {
        if (user.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only nonprofit organizations can update applications.');
        }
        const applications = await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoin('application.job', 'job')
            .where('application.id IN (:...ids)', { ids: applicationIds })
            .andWhere('job.orgUserId = :userId', { userId: user.id })
            .getMany();
        if (applications.length !== applicationIds.length) {
            throw new common_1.ForbiddenException('Some applications do not belong to your organization.');
        }
        for (const application of applications) {
            application.status = status;
            if (notes) {
                application.notes = notes;
            }
        }
        await this.applicationRepository.save(applications);
        return {
            message: 'Application statuses updated successfully',
            updatedCount: applications.length,
        };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = ApplicationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jobs_service_1.JobsService])
], ApplicationsService);
//# sourceMappingURL=application.service.js.map