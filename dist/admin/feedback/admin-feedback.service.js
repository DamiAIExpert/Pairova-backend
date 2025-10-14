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
exports.AdminFeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_entity_1 = require("./entities/feedback.entity");
const user_entity_1 = require("../../users/shared/user.entity");
let AdminFeedbackService = class AdminFeedbackService {
    feedbackRepository;
    userRepository;
    constructor(feedbackRepository, userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }
    async findAll(paginationDto, filters = {}) {
        const { page = 1, limit = 10 } = paginationDto;
        const { status, priority, category, search } = filters;
        const queryBuilder = this.feedbackRepository
            .createQueryBuilder('feedback')
            .leftJoinAndSelect('feedback.assignedTo', 'assignedTo')
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('feedback.createdAt', 'DESC');
        if (status) {
            queryBuilder.andWhere('feedback.status = :status', { status });
        }
        if (priority) {
            queryBuilder.andWhere('feedback.priority = :priority', { priority });
        }
        if (category) {
            queryBuilder.andWhere('feedback.category = :category', { category });
        }
        if (search) {
            queryBuilder.andWhere('(feedback.title ILIKE :search OR feedback.description ILIKE :search OR feedback.userName ILIKE :search OR feedback.userEmail ILIKE :search)', { search: `%${search}%` });
        }
        const [feedback, total] = await queryBuilder.getManyAndCount();
        const feedbackData = feedback.map((item) => this.transformToDto(item));
        return {
            data: feedbackData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
            relations: ['assignedTo'],
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        return this.transformToDto(feedback);
    }
    async create(createFeedbackDto) {
        const feedback = this.feedbackRepository.create(createFeedbackDto);
        const savedFeedback = await this.feedbackRepository.save(feedback);
        return this.transformToDto(savedFeedback);
    }
    async update(id, updateFeedbackDto) {
        const feedback = await this.feedbackRepository.findOne({
            where: { id },
            relations: ['assignedTo'],
        });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        Object.assign(feedback, updateFeedbackDto);
        const savedFeedback = await this.feedbackRepository.save(feedback);
        return this.transformToDto(savedFeedback);
    }
    async remove(id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        await this.feedbackRepository.remove(feedback);
        return { message: 'Feedback deleted successfully' };
    }
    async getStatistics() {
        const total = await this.feedbackRepository.count();
        const statusCounts = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .select('feedback.status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('feedback.status')
            .getRawMany();
        const priorityCounts = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .select('feedback.priority')
            .addSelect('COUNT(*)', 'count')
            .groupBy('feedback.priority')
            .getRawMany();
        const categoryCounts = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .select('feedback.category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('feedback.category')
            .getRawMany();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const thisMonth = await this.feedbackRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(startOfMonth, new Date()),
            },
        });
        const resolvedThisMonth = await this.feedbackRepository.count({
            where: {
                status: feedback_entity_1.FeedbackStatus.RESOLVED,
                updatedAt: (0, typeorm_2.Between)(startOfMonth, new Date()),
            },
        });
        const resolvedFeedback = await this.feedbackRepository
            .createQueryBuilder('feedback')
            .select('AVG(EXTRACT(EPOCH FROM (feedback.updatedAt - feedback.createdAt)))', 'avgResolutionTime')
            .where('feedback.status = :status', { status: feedback_entity_1.FeedbackStatus.RESOLVED })
            .getRawOne();
        const avgResolutionTimeHours = resolvedFeedback?.avgResolutionTime
            ? Math.round(resolvedFeedback.avgResolutionTime / 3600 * 100) / 100
            : 0;
        return {
            total,
            thisMonth,
            resolvedThisMonth,
            avgResolutionTimeHours,
            statusCounts: statusCounts.reduce((acc, item) => {
                acc[item.feedback_status] = parseInt(item.count);
                return acc;
            }, {}),
            priorityCounts: priorityCounts.reduce((acc, item) => {
                acc[item.feedback_priority] = parseInt(item.count);
                return acc;
            }, {}),
            categoryCounts: categoryCounts.reduce((acc, item) => {
                acc[item.feedback_category] = parseInt(item.count);
                return acc;
            }, {}),
        };
    }
    transformToDto(feedback) {
        return {
            id: feedback.id,
            title: feedback.title,
            description: feedback.description,
            category: feedback.category,
            status: feedback.status,
            priority: feedback.priority,
            userEmail: feedback.userEmail,
            userName: feedback.userName,
            userId: feedback.userId,
            adminNotes: feedback.adminNotes,
            assignedToId: feedback.assignedToId,
            assignedToName: feedback.assignedTo?.email || undefined,
            browserInfo: feedback.browserInfo,
            deviceInfo: feedback.deviceInfo,
            pageUrl: feedback.pageUrl,
            metadata: feedback.metadata,
            createdAt: feedback.createdAt,
            updatedAt: feedback.updatedAt,
        };
    }
};
exports.AdminFeedbackService = AdminFeedbackService;
exports.AdminFeedbackService = AdminFeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminFeedbackService);
//# sourceMappingURL=admin-feedback.service.js.map