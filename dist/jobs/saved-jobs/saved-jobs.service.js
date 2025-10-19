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
exports.SavedJobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const saved_job_entity_1 = require("../entities/saved-job.entity");
const job_entity_1 = require("../entities/job.entity");
let SavedJobsService = class SavedJobsService {
    savedJobsRepository;
    jobsRepository;
    constructor(savedJobsRepository, jobsRepository) {
        this.savedJobsRepository = savedJobsRepository;
        this.jobsRepository = jobsRepository;
    }
    async saveJob(userId, jobId) {
        const job = await this.jobsRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        const existingSavedJob = await this.savedJobsRepository.findOne({
            where: { userId, jobId },
        });
        if (existingSavedJob) {
            throw new common_1.ConflictException('Job already saved');
        }
        const savedJob = this.savedJobsRepository.create({
            userId,
            jobId,
        });
        return this.savedJobsRepository.save(savedJob);
    }
    async unsaveJob(userId, jobId) {
        const savedJob = await this.savedJobsRepository.findOne({
            where: { userId, jobId },
        });
        if (!savedJob) {
            throw new common_1.NotFoundException('Saved job not found');
        }
        await this.savedJobsRepository.remove(savedJob);
    }
    async getSavedJobs(userId, page = 1, limit = 20) {
        const [savedJobs, total] = await this.savedJobsRepository.findAndCount({
            where: { userId },
            relations: ['job', 'job.organization'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const jobs = savedJobs.map(savedJob => savedJob.job);
        return {
            jobs,
            total,
            page,
            limit,
        };
    }
    async isJobSaved(userId, jobId) {
        const savedJob = await this.savedJobsRepository.findOne({
            where: { userId, jobId },
        });
        return !!savedJob;
    }
};
exports.SavedJobsService = SavedJobsService;
exports.SavedJobsService = SavedJobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(saved_job_entity_1.SavedJob)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SavedJobsService);
//# sourceMappingURL=saved-jobs.service.js.map