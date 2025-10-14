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
exports.AdminSmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_enum_1 = require("../../common/enums/user.enum");
const sms_service_1 = require("../services/sms.service");
const sms_provider_dto_1 = require("../dto/sms-provider.dto");
const sms_log_entity_1 = require("../entities/sms-log.entity");
let AdminSmsController = class AdminSmsController {
    smsService;
    constructor(smsService) {
        this.smsService = smsService;
    }
    async createProvider(createProviderDto) {
        return await this.smsService.createProvider(createProviderDto);
    }
    async getProviders() {
        return await this.smsService.getProviders();
    }
    async getProvider(id) {
        return await this.smsService.getProvider(id);
    }
    async updateProvider(id, updateProviderDto) {
        return await this.smsService.updateProvider(id, updateProviderDto);
    }
    async deleteProvider(id) {
        await this.smsService.deleteProvider(id);
        return { message: 'SMS provider deleted successfully' };
    }
    async toggleProviderStatus(id, isActive) {
        return await this.smsService.toggleProviderStatus(id, isActive);
    }
    async updateProviderPriority(id, priority) {
        return await this.smsService.updateProviderPriority(id, priority);
    }
    async performHealthCheck(id) {
        await this.smsService.performHealthCheck(id);
        return { message: 'Health check completed successfully' };
    }
    async performHealthCheckAll() {
        await this.smsService.performHealthCheckAll();
        return { message: 'Health check completed for all providers' };
    }
    async getSmsLogs(page = 1, limit = 50, providerId, status, type, recipient, startDate, endDate) {
        const filters = {};
        if (providerId)
            filters.providerId = providerId;
        if (status)
            filters.status = status;
        if (type)
            filters.type = type;
        if (recipient)
            filters.recipient = recipient;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        const result = await this.smsService.getSmsLogs(page, limit, filters);
        return {
            ...result,
            totalPages: Math.ceil(result.total / result.limit),
        };
    }
    async getSmsStatistics() {
        return await this.smsService.getSmsStatistics();
    }
    async sendTestSms(body) {
        const testMessage = body.message || 'Test SMS from Pairova Admin Panel';
        const smsLog = await this.smsService.sendSms({
            recipient: body.recipient,
            message: testMessage,
            type: sms_log_entity_1.SmsType.SYSTEM,
            preferredProviderId: body.providerId,
            metadata: {
                source: 'admin_test',
                testMessage: true,
            },
        });
        return {
            message: 'Test SMS sent successfully',
            logId: smsLog.id,
        };
    }
    async getSupportedProviderTypes() {
        return {
            types: [
                {
                    type: 'TWILIO',
                    name: 'Twilio',
                    description: 'Global SMS provider with robust API and excellent delivery rates',
                    features: ['bulk', 'unicode', 'delivery_reports', 'scheduling', 'international'],
                    website: 'https://www.twilio.com',
                },
                {
                    type: 'CLICKATELL',
                    name: 'Clickatell',
                    description: 'Enterprise SMS platform with high delivery rates',
                    features: ['bulk', 'unicode', 'delivery_reports', 'scheduling'],
                    website: 'https://www.clickatell.com',
                },
                {
                    type: 'MSG91',
                    name: 'MSG91',
                    description: 'Popular SMS provider in South Africa with competitive pricing',
                    features: ['bulk', 'unicode', 'delivery_reports'],
                    website: 'https://msg91.com',
                },
                {
                    type: 'AFRICASTALKING',
                    name: 'Africastalking',
                    description: 'African-focused SMS provider with local expertise',
                    features: ['bulk', 'unicode', 'delivery_reports'],
                    website: 'https://africastalking.com',
                },
                {
                    type: 'NEXMO',
                    name: 'Nexmo (Vonage)',
                    description: 'Reliable SMS service with competitive pricing',
                    features: ['bulk', 'unicode', 'delivery_reports'],
                    website: 'https://www.vonage.com',
                },
                {
                    type: 'CM_COM',
                    name: 'CM.com',
                    description: 'European SMS provider with strong API capabilities',
                    features: ['bulk', 'unicode', 'delivery_reports', 'scheduling'],
                    website: 'https://www.cm.com',
                },
                {
                    type: 'TELESIGN',
                    name: 'Telesign',
                    description: 'Global communications platform with SMS capabilities',
                    features: ['bulk', 'unicode', 'delivery_reports'],
                    website: 'https://www.telesign.com',
                },
            ],
        };
    }
};
exports.AdminSmsController = AdminSmsController;
__decorate([
    (0, common_1.Post)('providers'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create new SMS provider configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'SMS provider created successfully',
        type: sms_provider_dto_1.SmsProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid provider configuration' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_provider_dto_1.CreateSmsProviderDto]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "createProvider", null);
__decorate([
    (0, common_1.Get)('providers'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SMS providers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS providers retrieved successfully',
        type: [sms_provider_dto_1.SmsProviderResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Get)('providers/:id'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get SMS provider by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS provider retrieved successfully',
        type: sms_provider_dto_1.SmsProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "getProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update SMS provider configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS provider updated successfully',
        type: sms_provider_dto_1.SmsProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid provider configuration' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sms_provider_dto_1.UpdateSmsProviderDto]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "updateProvider", null);
__decorate([
    (0, common_1.Delete)('providers/:id'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete SMS provider' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS provider deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "deleteProvider", null);
__decorate([
    (0, common_1.Put)('providers/:id/toggle'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle SMS provider active status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Provider status toggled successfully',
        type: sms_provider_dto_1.SmsProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "toggleProviderStatus", null);
__decorate([
    (0, common_1.Put)('providers/:id/priority'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update SMS provider priority' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Provider priority updated successfully',
        type: sms_provider_dto_1.SmsProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "updateProviderPriority", null);
__decorate([
    (0, common_1.Post)('providers/:id/health-check'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Perform health check on SMS provider' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health check completed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'SMS provider not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "performHealthCheck", null);
__decorate([
    (0, common_1.Post)('providers/health-check-all'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Perform health check on all SMS providers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health check completed for all providers',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "performHealthCheckAll", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get SMS logs with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS logs retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: sms_log_entity_1.SmsStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: sms_log_entity_1.SmsType, description: 'Filter by type' }),
    (0, swagger_1.ApiQuery)({ name: 'recipient', required: false, type: String, description: 'Filter by recipient' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Filter from date (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Filter to date (ISO string)' }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('providerId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('recipient')),
    __param(6, (0, common_1.Query)('startDate')),
    __param(7, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "getSmsLogs", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get SMS statistics and analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'SMS statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "getSmsStatistics", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Send test SMS message' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Test SMS sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Failed to send test SMS' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "sendTestSms", null);
__decorate([
    (0, common_1.Get)('provider-types'),
    (0, roles_decorator_1.Roles)(user_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get supported SMS provider types' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Supported provider types retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSmsController.prototype, "getSupportedProviderTypes", null);
exports.AdminSmsController = AdminSmsController = __decorate([
    (0, swagger_1.ApiTags)('Admin SMS'),
    (0, common_1.Controller)('admin/sms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], AdminSmsController);
//# sourceMappingURL=admin-sms.controller.js.map