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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
const role_enum_1 = require("../../common/enums/role.enum");
const jobs_service_1 = require("../jobs.service");
let ApplicationsService = class ApplicationsService {
    applicationRepository;
    jobsService;
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
    async findAllForUser(user) {
        if (user.role === role_enum_1.Role.APPLICANT) {
            return this.applicationRepository.find({
                where: { applicantId: user.id },
                relations: ['job', 'job.organization'],
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
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jobs_service_1.JobsService])
], ApplicationsService);
//# sourceMappingURL=application.service.js.map