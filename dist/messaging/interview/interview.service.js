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
exports.InterviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interview_entity_1 = require("./entities/interview.entity");
const role_enum_1 = require("../../common/enums/role.enum");
const application_entity_1 = require("../../jobs/entities/application.entity");
let InterviewService = class InterviewService {
    interviewRepository;
    applicationRepository;
    constructor(interviewRepository, applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }
    async schedule(dto, scheduler) {
        const application = await this.applicationRepository.findOne({
            where: { id: dto.applicationId },
            relations: ['job']
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${dto.applicationId} not found.`);
        }
        if (scheduler.role !== role_enum_1.Role.NONPROFIT || application.job.orgUserId !== scheduler.id) {
            throw new common_1.ForbiddenException('You are not authorized to schedule an interview for this application.');
        }
        const interview = this.interviewRepository.create({
            ...dto,
            scheduledById: scheduler.id,
        });
        return this.interviewRepository.save(interview);
    }
    async findOne(id) {
        const interview = await this.interviewRepository.findOne({ where: { id }, relations: ['application', 'application.job', 'application.applicant'] });
        if (!interview) {
            throw new common_1.NotFoundException(`Interview with ID "${id}" not found.`);
        }
        return interview;
    }
};
exports.InterviewService = InterviewService;
exports.InterviewService = InterviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interview_entity_1.Interview)),
    __param(1, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InterviewService);
//# sourceMappingURL=interview.service.js.map