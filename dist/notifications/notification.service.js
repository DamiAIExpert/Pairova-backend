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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_type_enum_1 = require("../common/enums/notification-type.enum");
let NotificationService = class NotificationService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async createNotification(userId, type, title, body, data) {
        const notification = this.notificationRepository.create({
            userId,
            type,
            title,
            body,
            data,
        });
        return this.notificationRepository.save(notification);
    }
    async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId })
            .orderBy('notification.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (unreadOnly) {
            queryBuilder.andWhere('notification.readAt IS NULL');
        }
        const [notifications, total] = await queryBuilder.getManyAndCount();
        const unreadCount = await this.notificationRepository.count({
            where: { userId, readAt: null },
        });
        return {
            notifications,
            total,
            page,
            limit,
            unreadCount,
        };
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (!notification.readAt) {
            notification.readAt = new Date();
            return this.notificationRepository.save(notification);
        }
        return notification;
    }
    async markAllAsRead(userId) {
        const result = await this.notificationRepository.update({ userId, readAt: null }, { readAt: new Date() });
        return {
            message: 'All notifications marked as read',
            count: result.affected || 0,
        };
    }
    async deleteNotification(notificationId, userId) {
        const result = await this.notificationRepository.delete({
            id: notificationId,
            userId,
        });
        if (!result.affected) {
            throw new common_1.NotFoundException('Notification not found');
        }
    }
    async getUserNotificationStats(userId) {
        const total = await this.notificationRepository.count({ where: { userId } });
        const unread = await this.notificationRepository.count({
            where: { userId, readAt: null },
        });
        const byType = await this.notificationRepository
            .createQueryBuilder('notification')
            .select('notification.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('notification.userId = :userId', { userId })
            .groupBy('notification.type')
            .getRawMany();
        const typeStats = Object.values(notification_type_enum_1.NotificationType).reduce((acc, type) => {
            acc[type] = 0;
            return acc;
        }, {});
        byType.forEach(item => {
            typeStats[item.type] = parseInt(item.count);
        });
        return {
            total,
            unread,
            byType: typeStats,
        };
    }
    async createJobMatchNotification(userId, jobTitle, jobId) {
        return this.createNotification(userId, notification_type_enum_1.NotificationType.JOB_MATCH, 'New Job Match Found!', `We found a job that matches your profile: ${jobTitle}`, { jobId, jobTitle });
    }
    async createApplicationUpdateNotification(userId, jobTitle, status, applicationId) {
        return this.createNotification(userId, notification_type_enum_1.NotificationType.APPLICATION_UPDATE, 'Application Status Update', `Your application for "${jobTitle}" has been ${status.toLowerCase()}`, { jobTitle, status, applicationId });
    }
    async createInterviewNotification(userId, jobTitle, interviewDate, interviewId) {
        return this.createNotification(userId, notification_type_enum_1.NotificationType.INTERVIEW, 'Interview Scheduled', `You have an interview scheduled for "${jobTitle}" on ${interviewDate.toLocaleDateString()}`, { jobTitle, interviewDate, interviewId });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map