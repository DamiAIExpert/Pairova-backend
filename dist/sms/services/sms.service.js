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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sms_provider_entity_1 = require("../entities/sms-provider.entity");
const sms_log_entity_1 = require("../entities/sms-log.entity");
const sms_provider_factory_service_1 = require("./sms-provider-factory.service");
let SmsService = SmsService_1 = class SmsService {
    smsProviderRepository;
    smsLogRepository;
    smsProviderFactory;
    logger = new common_1.Logger(SmsService_1.name);
    constructor(smsProviderRepository, smsLogRepository, smsProviderFactory) {
        this.smsProviderRepository = smsProviderRepository;
        this.smsLogRepository = smsLogRepository;
        this.smsProviderFactory = smsProviderFactory;
    }
    async createProvider(createProviderDto) {
        try {
            const isValid = await this.smsProviderFactory.validateProviderConfig(createProviderDto.providerType, createProviderDto.configuration);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid provider configuration');
            }
            const provider = this.smsProviderRepository.create({
                ...createProviderDto,
                status: sms_provider_entity_1.SmsProviderStatus.ACTIVE,
                isHealthy: true,
            });
            const savedProvider = await this.smsProviderRepository.save(provider);
            await this.performHealthCheck(savedProvider.id);
            this.logger.log(`Created SMS provider: ${savedProvider.name} (${savedProvider.providerType})`);
            return savedProvider;
        }
        catch (error) {
            this.logger.error(`Failed to create SMS provider: ${error.message}`);
            throw error;
        }
    }
    async updateProvider(id, updateProviderDto) {
        const provider = await this.smsProviderRepository.findOne({ where: { id } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        if (updateProviderDto.configuration) {
            const isValid = await this.smsProviderFactory.validateProviderConfig(provider.providerType, updateProviderDto.configuration);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid provider configuration');
            }
        }
        Object.assign(provider, updateProviderDto);
        const updatedProvider = await this.smsProviderRepository.save(provider);
        await this.performHealthCheck(id);
        this.logger.log(`Updated SMS provider: ${updatedProvider.name}`);
        return updatedProvider;
    }
    async getProviders() {
        return await this.smsProviderRepository.find({
            order: { priority: 'ASC', name: 'ASC' },
        });
    }
    async getProvider(id) {
        const provider = await this.smsProviderRepository.findOne({ where: { id } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        return provider;
    }
    async deleteProvider(id) {
        const provider = await this.smsProviderRepository.findOne({ where: { id } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        await this.smsProviderRepository.remove(provider);
        this.logger.log(`Deleted SMS provider: ${provider.name}`);
    }
    async sendSms(sendSmsDto) {
        const { recipient, message, type = sms_log_entity_1.SmsType.NOTIFICATION, preferredProviderId, campaignId, metadata } = sendSmsDto;
        let providers = await this.smsProviderRepository.find({
            where: {
                isActive: true,
                isEnabled: true,
                status: sms_provider_entity_1.SmsProviderStatus.ACTIVE,
                isHealthy: true,
            },
            order: { priority: 'ASC' },
        });
        if (preferredProviderId) {
            const preferredProvider = providers.find(p => p.id === preferredProviderId);
            if (preferredProvider) {
                providers = [preferredProvider, ...providers.filter(p => p.id !== preferredProviderId)];
            }
        }
        if (providers.length === 0) {
            throw new common_1.BadRequestException('No active SMS providers available');
        }
        let lastError = null;
        for (const provider of providers) {
            try {
                const result = await this.attemptSendSms(provider, recipient, message, type, campaignId, metadata);
                if (result.success) {
                    this.logger.log(`SMS sent successfully via ${provider.name} to ${recipient}`);
                    await this.updateProviderStats(provider.id, true);
                    return result.smsLog;
                }
                else {
                    lastError = result.error || 'Unknown error';
                    this.logger.warn(`SMS send failed via ${provider.name}: ${lastError}`);
                    await this.updateProviderStats(provider.id, false, lastError);
                }
            }
            catch (error) {
                lastError = error.message;
                this.logger.error(`SMS send error via ${provider.name}: ${error.message}`);
                await this.updateProviderStats(provider.id, false, lastError);
            }
        }
        const failedLog = this.smsLogRepository.create({
            providerId: providers[0].id,
            providerName: providers[0].name,
            recipient,
            message,
            type: type,
            status: sms_log_entity_1.SmsStatus.FAILED,
            errorMessage: `All providers failed. Last error: ${lastError}`,
            errorCode: 'ALL_PROVIDERS_FAILED',
            campaignId,
            metadata,
            failedAt: new Date(),
        });
        return await this.smsLogRepository.save(failedLog);
    }
    async attemptSendSms(provider, recipient, message, type, campaignId, metadata) {
        try {
            const smsProvider = this.smsProviderFactory.createProvider(provider.providerType, provider.configuration);
            const smsLog = this.smsLogRepository.create({
                providerId: provider.id,
                recipient,
                message,
                type,
                status: sms_log_entity_1.SmsStatus.PENDING,
                campaignId,
                metadata,
            });
            const savedLog = await this.smsLogRepository.save(smsLog);
            const result = await smsProvider.sendSms(recipient, message);
            savedLog.status = result.success ? sms_log_entity_1.SmsStatus.SENT : sms_log_entity_1.SmsStatus.FAILED;
            savedLog.providerMessageId = result.messageId;
            savedLog.providerReference = result.providerReference;
            savedLog.cost = result.cost;
            savedLog.currency = result.currency;
            savedLog.errorMessage = result.error;
            savedLog.errorCode = result.errorCode;
            savedLog.sentAt = result.success ? new Date() : null;
            savedLog.failedAt = result.success ? null : new Date();
            const updatedLog = await this.smsLogRepository.save(savedLog);
            return {
                success: result.success,
                smsLog: updatedLog,
                error: result.error,
            };
        }
        catch (error) {
            this.logger.error(`SMS send attempt failed for provider ${provider.name}: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async updateProviderStats(providerId, success, error) {
        await this.smsProviderRepository
            .createQueryBuilder()
            .update(sms_provider_entity_1.SmsProvider)
            .set({
            totalSent: () => 'total_sent + 1',
            totalDelivered: success ? () => 'total_delivered + 1' : undefined,
            totalErrors: success ? undefined : () => 'total_errors + 1',
            lastError: error || undefined,
            lastUsed: new Date(),
            deliveryRate: () => `
          CASE 
            WHEN total_sent > 0 
            THEN ROUND((total_delivered::decimal / total_sent::decimal) * 100, 2)
            ELSE 0 
          END
        `,
        })
            .where('id = :id', { id: providerId })
            .execute();
    }
    async performHealthCheck(providerId) {
        const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        try {
            const smsProvider = this.smsProviderFactory.createProvider(provider.providerType, provider.configuration);
            const healthStatus = await smsProvider.getHealthStatus();
            await this.smsProviderRepository.update(providerId, {
                isHealthy: healthStatus.isHealthy,
                lastHealthCheck: healthStatus.lastChecked,
                status: healthStatus.isHealthy ? sms_provider_entity_1.SmsProviderStatus.ACTIVE : sms_provider_entity_1.SmsProviderStatus.ERROR,
                lastError: healthStatus.error || null,
            });
            this.logger.log(`Health check for ${provider.name}: ${healthStatus.isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        }
        catch (error) {
            await this.smsProviderRepository.update(providerId, {
                isHealthy: false,
                lastHealthCheck: new Date(),
                status: sms_provider_entity_1.SmsProviderStatus.ERROR,
                lastError: error.message,
            });
            this.logger.error(`Health check failed for ${provider.name}: ${error.message}`);
        }
    }
    async performHealthCheckAll() {
        const providers = await this.smsProviderRepository.find({
            where: { isActive: true, isEnabled: true },
        });
        this.logger.log(`Performing health check on ${providers.length} providers`);
        const healthCheckPromises = providers.map(provider => this.performHealthCheck(provider.id).catch(error => this.logger.error(`Health check failed for ${provider.name}: ${error.message}`)));
        await Promise.all(healthCheckPromises);
    }
    async getSmsLogs(page = 1, limit = 50, filters) {
        const queryBuilder = this.smsLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.provider', 'provider')
            .orderBy('log.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (filters?.providerId) {
            queryBuilder.andWhere('log.providerId = :providerId', { providerId: filters.providerId });
        }
        if (filters?.status) {
            queryBuilder.andWhere('log.status = :status', { status: filters.status });
        }
        if (filters?.type) {
            queryBuilder.andWhere('log.type = :type', { type: filters.type });
        }
        if (filters?.recipient) {
            queryBuilder.andWhere('log.recipient ILIKE :recipient', { recipient: `%${filters.recipient}%` });
        }
        if (filters?.startDate) {
            queryBuilder.andWhere('log.createdAt >= :startDate', { startDate: filters.startDate });
        }
        if (filters?.endDate) {
            queryBuilder.andWhere('log.createdAt <= :endDate', { endDate: filters.endDate });
        }
        const [logs, total] = await queryBuilder.getManyAndCount();
        return {
            logs,
            total,
            page,
            limit,
        };
    }
    async getSmsStatistics() {
        const totalStats = await this.smsLogRepository
            .createQueryBuilder('log')
            .select([
            'COUNT(*) as totalSent',
            'COUNT(CASE WHEN status = :delivered THEN 1 END) as totalDelivered',
            'COUNT(CASE WHEN status = :failed THEN 1 END) as totalFailed',
            'SUM(COALESCE(cost, 0)) as totalCost',
        ])
            .setParameters({
            delivered: sms_log_entity_1.SmsStatus.DELIVERED,
            failed: sms_log_entity_1.SmsStatus.FAILED,
        })
            .getRawOne();
        const providerStats = await this.smsLogRepository
            .createQueryBuilder('log')
            .leftJoin('log.provider', 'provider')
            .select([
            'provider.id as providerId',
            'provider.name as providerName',
            'COUNT(*) as totalSent',
            'COUNT(CASE WHEN log.status = :delivered THEN 1 END) as totalDelivered',
            'SUM(COALESCE(log.cost, 0)) as totalCost',
        ])
            .setParameters({
            delivered: sms_log_entity_1.SmsStatus.DELIVERED,
        })
            .groupBy('provider.id, provider.name')
            .getRawMany();
        const deliveryRate = totalStats.totalSent > 0
            ? (totalStats.totalDelivered / totalStats.totalSent) * 100
            : 0;
        return {
            totalSent: parseInt(totalStats.totalSent) || 0,
            totalDelivered: parseInt(totalStats.totalDelivered) || 0,
            totalFailed: parseInt(totalStats.totalFailed) || 0,
            deliveryRate: Math.round(deliveryRate * 100) / 100,
            totalCost: parseFloat(totalStats.totalCost) || 0,
            providerStats: providerStats.map(stat => ({
                providerId: stat.providerId,
                providerName: stat.providerName,
                totalSent: parseInt(stat.totalSent) || 0,
                totalDelivered: parseInt(stat.totalDelivered) || 0,
                deliveryRate: stat.totalSent > 0
                    ? Math.round((stat.totalDelivered / stat.totalSent) * 100 * 100) / 100
                    : 0,
                totalCost: parseFloat(stat.totalCost) || 0,
            })),
        };
    }
    async toggleProviderStatus(providerId, isActive) {
        const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        provider.isActive = isActive;
        provider.status = isActive ? sms_provider_entity_1.SmsProviderStatus.ACTIVE : sms_provider_entity_1.SmsProviderStatus.INACTIVE;
        const updatedProvider = await this.smsProviderRepository.save(provider);
        this.logger.log(`${isActive ? 'Activated' : 'Deactivated'} SMS provider: ${provider.name}`);
        return updatedProvider;
    }
    async updateProviderPriority(providerId, priority) {
        const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
        if (!provider) {
            throw new common_1.NotFoundException('SMS provider not found');
        }
        provider.priority = priority;
        const updatedProvider = await this.smsProviderRepository.save(provider);
        this.logger.log(`Updated priority for SMS provider ${provider.name} to ${priority}`);
        return updatedProvider;
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sms_provider_entity_1.SmsProvider)),
    __param(1, (0, typeorm_1.InjectRepository)(sms_log_entity_1.SmsLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        sms_provider_factory_service_1.SmsProviderFactory])
], SmsService);
//# sourceMappingURL=sms.service.js.map