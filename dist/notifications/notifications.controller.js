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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const email_service_1 = require("./email.service");
const reminder_service_1 = require("./reminder.service");
const notification_service_1 = require("./notification.service");
const notification_preferences_service_1 = require("./notification-preferences.service");
let NotificationsController = class NotificationsController {
    emailService;
    reminderService;
    notificationService;
    preferencesService;
    constructor(emailService, reminderService, notificationService, preferencesService) {
        this.emailService = emailService;
        this.reminderService = reminderService;
        this.notificationService = notificationService;
        this.preferencesService = preferencesService;
    }
    async sendEmail(emailData, req) {
        let result;
        if (emailData.template) {
            result = await this.emailService.sendFromTemplate(emailData.to, emailData.subject, emailData.template, emailData.data || {});
        }
        else {
            result = await this.emailService.send(emailData.to, emailData.subject, emailData.html || '');
        }
        if (result.error) {
            throw new Error(result.error);
        }
        return {
            message: 'Email sent successfully',
            messageId: result.messageId,
        };
    }
    async getEmailHistory(req, page = 1, limit = 20) {
        return {
            emails: [],
            total: 0,
            page,
            limit,
        };
    }
    async createReminder(reminderData, req) {
        const reminder = await this.reminderService.scheduleReminder(req.user, 'EMAIL', reminderData.title, {
            description: reminderData.description,
            type: reminderData.type,
        }, new Date(reminderData.remindAt));
        return {
            message: 'Reminder created successfully',
            reminderId: reminder.id,
        };
    }
    async getReminders(req, status, page = 1, limit = 20) {
        return {
            reminders: [],
            total: 0,
            page,
            limit,
        };
    }
    async updateReminder(id, updateData, req) {
        return { message: 'Reminder updated successfully' };
    }
    async deleteReminder(id, req) {
        return { message: 'Reminder deleted successfully' };
    }
    async getNotifications(req, page = 1, limit = 20, unreadOnly = false) {
        return this.notificationService.getUserNotifications(req.user.id, page, limit, unreadOnly);
    }
    async markAsRead(id, req) {
        await this.notificationService.markAsRead(id, req.user.id);
        return { message: 'Notification marked as read' };
    }
    async markAllAsRead(req) {
        return this.notificationService.markAllAsRead(req.user.id);
    }
    async deleteNotification(id, req) {
        await this.notificationService.deleteNotification(id, req.user.id);
        return { message: 'Notification deleted successfully' };
    }
    async getUserNotificationStats(req) {
        return this.notificationService.getUserNotificationStats(req.user.id);
    }
    async getPreferences(req) {
        return this.preferencesService.getPreferencesForApi(req.user.id);
    }
    async updatePreferences(preferences, req) {
        await this.preferencesService.updatePreferences(req.user.id, preferences);
        return { message: 'Preferences updated successfully' };
    }
    async getNotificationStatistics() {
        return {
            totalEmails: 0,
            emailsToday: 0,
            totalReminders: 0,
            activeReminders: 0,
            emailDeliveryRate: 0,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send email notification' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Email sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Email service error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)('email/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user email notification history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email history retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getEmailHistory", null);
__decorate([
    (0, common_1.Post)('reminders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new reminder' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reminder created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createReminder", null);
__decorate([
    (0, common_1.Get)('reminders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user reminders' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reminders retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getReminders", null);
__decorate([
    (0, common_1.Put)('reminders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reminder status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reminder updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reminder not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateReminder", null);
__decorate([
    (0, common_1.Delete)('reminders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete reminder' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reminder deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reminder not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteReminder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notifications retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'unreadOnly', required: false, type: Boolean, description: 'Show only unread notifications' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('unreadOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification marked as read',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All notifications marked as read',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notification statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotificationStats", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notification preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Put)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user notification preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences updated successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('admin/statistics'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationStatistics", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        reminder_service_1.ReminderService,
        notification_service_1.NotificationService,
        notification_preferences_service_1.NotificationPreferencesService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map