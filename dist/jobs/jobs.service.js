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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
const role_enum_1 = require("../common/enums/role.enum");
const job_enum_1 = require("../common/enums/job.enum");
let JobsService = class JobsService {
    jobsRepository;
    constructor(jobsRepository) {
        this.jobsRepository = jobsRepository;
    }
    async create(createJobDto, currentUser) {
        if (currentUser.role !== role_enum_1.Role.NONPROFIT) {
            throw new common_1.ForbiddenException('Only non-profit organizations can post jobs.');
        }
        const job = this.jobsRepository.create({
            ...createJobDto,
            orgUserId: currentUser.id,
            createdBy: currentUser.id,
            status: createJobDto.status || job_enum_1.JobStatus.DRAFT,
        });
        return this.jobsRepository.save(job);
    }
    async findAllPublished() {
        return this.jobsRepository.find({
            where: { status: job_enum_1.JobStatus.PUBLISHED },
            relations: ['organization'],
        });
    }
    async findOne(id) {
        const job = await this.jobsRepository.findOne({
            where: { id },
            relations: ['organization', 'applications'],
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID "${id}" not found.`);
        }
        return job;
    }
    async publish(id, currentUser) {
        const job = await this.findOne(id);
        if (currentUser.role !== role_enum_1.Role.NONPROFIT || job.orgUserId !== currentUser.id) {
            throw new common_1.ForbiddenException('Only the job owner can publish this job.');
        }
        if (job.status !== job_enum_1.JobStatus.DRAFT) {
            throw new common_1.ForbiddenException('Only draft jobs can be published.');
        }
        job.status = job_enum_1.JobStatus.PUBLISHED;
        return this.jobsRepository.save(job);
    }
    async close(id, currentUser) {
        const job = await this.findOne(id);
        if (currentUser.role !== role_enum_1.Role.NONPROFIT || job.orgUserId !== currentUser.id) {
            throw new common_1.ForbiddenException('Only the job owner can close this job.');
        }
        if (job.status === job_enum_1.JobStatus.CLOSED) {
            throw new common_1.ForbiddenException('Job is already closed.');
        }
        job.status = job_enum_1.JobStatus.CLOSED;
        return this.jobsRepository.save(job);
    }
    async getFeaturedJobs(limit = 10) {
        return this.jobsRepository.find({
            where: { status: job_enum_1.JobStatus.PUBLISHED },
            relations: ['organization'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map