import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsProvider, SmsProviderType, SmsProviderStatus } from '../entities/sms-provider.entity';
import { SmsLog, SmsStatus, SmsType } from '../entities/sms-log.entity';
import { SmsProviderFactory, SmsSendResult } from './sms-provider-factory.service';
import { CreateSmsProviderDto, UpdateSmsProviderDto, SendSmsDto } from '../dto/sms-provider.dto';

/**
 * @class SmsService
 * @description Main service for SMS operations with provider management and failover
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    @InjectRepository(SmsProvider)
    private readonly smsProviderRepository: Repository<SmsProvider>,
    @InjectRepository(SmsLog)
    private readonly smsLogRepository: Repository<SmsLog>,
    private readonly smsProviderFactory: SmsProviderFactory,
  ) {}

  /**
   * Create new SMS provider
   */
  async createProvider(createProviderDto: CreateSmsProviderDto): Promise<SmsProvider> {
    try {
      // Validate provider configuration
      const isValid = await this.smsProviderFactory.validateProviderConfig(
        createProviderDto.providerType,
        createProviderDto.configuration,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid provider configuration');
      }

      const provider = this.smsProviderRepository.create({
        ...createProviderDto,
        status: SmsProviderStatus.ACTIVE,
        isHealthy: true,
      });

      const savedProvider = await this.smsProviderRepository.save(provider);
      
      // Perform initial health check
      await this.performHealthCheck(savedProvider.id);

      this.logger.log(`Created SMS provider: ${savedProvider.name} (${savedProvider.providerType})`);
      return savedProvider;
    } catch (error) {
      this.logger.error(`Failed to create SMS provider: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update SMS provider
   */
  async updateProvider(id: string, updateProviderDto: UpdateSmsProviderDto): Promise<SmsProvider> {
    const provider = await this.smsProviderRepository.findOne({ where: { id } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    // If configuration is being updated, validate it
    if (updateProviderDto.configuration) {
      const isValid = await this.smsProviderFactory.validateProviderConfig(
        provider.providerType,
        updateProviderDto.configuration,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid provider configuration');
      }
    }

    Object.assign(provider, updateProviderDto);
    const updatedProvider = await this.smsProviderRepository.save(provider);

    // Perform health check after update
    await this.performHealthCheck(id);

    this.logger.log(`Updated SMS provider: ${updatedProvider.name}`);
    return updatedProvider;
  }

  /**
   * Get all SMS providers
   */
  async getProviders(): Promise<SmsProvider[]> {
    return await this.smsProviderRepository.find({
      order: { priority: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get SMS provider by ID
   */
  async getProvider(id: string): Promise<SmsProvider> {
    const provider = await this.smsProviderRepository.findOne({ where: { id } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    return provider;
  }

  /**
   * Delete SMS provider
   */
  async deleteProvider(id: string): Promise<void> {
    const provider = await this.smsProviderRepository.findOne({ where: { id } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    await this.smsProviderRepository.remove(provider);
    this.logger.log(`Deleted SMS provider: ${provider.name}`);
  }

  /**
   * Send SMS with automatic failover
   */
  async sendSms(sendSmsDto: SendSmsDto): Promise<SmsLog> {
    const { recipient, message, type = SmsType.NOTIFICATION, preferredProviderId, campaignId, metadata } = sendSmsDto;

    // Get available providers (ordered by priority)
    let providers = await this.smsProviderRepository.find({
      where: {
        isActive: true,
        isEnabled: true,
        status: SmsProviderStatus.ACTIVE,
        isHealthy: true,
      },
      order: { priority: 'ASC' },
    });

    // If preferred provider is specified, prioritize it
    if (preferredProviderId) {
      const preferredProvider = providers.find(p => p.id === preferredProviderId);
      if (preferredProvider) {
        providers = [preferredProvider, ...providers.filter(p => p.id !== preferredProviderId)];
      }
    }

    if (providers.length === 0) {
      throw new BadRequestException('No active SMS providers available');
    }

    let lastError: string | null = null;
    
    // Try each provider in order of priority
    for (const provider of providers) {
      try {
        const result = await this.attemptSendSms(provider, recipient, message, type as SmsType, campaignId, metadata);
        
        if (result.success) {
          this.logger.log(`SMS sent successfully via ${provider.name} to ${recipient}`);
          
          // Update provider statistics
          await this.updateProviderStats(provider.id, true);
          
          return result.smsLog;
        } else {
          lastError = result.error || 'Unknown error';
          this.logger.warn(`SMS send failed via ${provider.name}: ${lastError}`);
          
          // Update provider statistics
          await this.updateProviderStats(provider.id, false, lastError);
        }
      } catch (error) {
        lastError = error.message;
        this.logger.error(`SMS send error via ${provider.name}: ${error.message}`);
        
        // Update provider statistics
        await this.updateProviderStats(provider.id, false, lastError);
      }
    }

    // If all providers failed, create a failed log entry
    const failedLog = this.smsLogRepository.create({
      providerId: providers[0].id, // Use first provider for logging
      providerName: providers[0].name,
      recipient,
      message,
      type: type as SmsType,
      status: SmsStatus.FAILED,
      errorMessage: `All providers failed. Last error: ${lastError}`,
      errorCode: 'ALL_PROVIDERS_FAILED',
      campaignId,
      metadata,
      failedAt: new Date(),
    });

    return await this.smsLogRepository.save(failedLog);
  }

  /**
   * Attempt to send SMS via specific provider
   */
  private async attemptSendSms(
    provider: SmsProvider,
    recipient: string,
    message: string,
    type: SmsType,
    campaignId?: string,
    metadata?: any,
  ): Promise<{ success: boolean; smsLog?: SmsLog; error?: string }> {
    try {
      // Create SMS provider instance
      const smsProvider = this.smsProviderFactory.createProvider(
        provider.providerType,
        provider.configuration,
      );

      // Create log entry
      const smsLog = this.smsLogRepository.create({
        providerId: provider.id,
        recipient,
        message,
        type,
        status: SmsStatus.PENDING,
        campaignId,
        metadata,
      });

      const savedLog = await this.smsLogRepository.save(smsLog);

      // Send SMS
      const result: SmsSendResult = await smsProvider.sendSms(recipient, message);

      // Update log with result
      savedLog.status = result.success ? SmsStatus.SENT : SmsStatus.FAILED;
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
    } catch (error) {
      this.logger.error(`SMS send attempt failed for provider ${provider.name}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update provider statistics
   */
  private async updateProviderStats(providerId: string, success: boolean, error?: string): Promise<void> {
    await this.smsProviderRepository
      .createQueryBuilder()
      .update(SmsProvider)
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

  /**
   * Perform health check on provider
   */
  async performHealthCheck(providerId: string): Promise<void> {
    const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    try {
      const smsProvider = this.smsProviderFactory.createProvider(
        provider.providerType,
        provider.configuration,
      );

      const healthStatus = await smsProvider.getHealthStatus();

      await this.smsProviderRepository.update(providerId, {
        isHealthy: healthStatus.isHealthy,
        lastHealthCheck: healthStatus.lastChecked,
        status: healthStatus.isHealthy ? SmsProviderStatus.ACTIVE : SmsProviderStatus.ERROR,
        lastError: healthStatus.error || null,
      });

      this.logger.log(`Health check for ${provider.name}: ${healthStatus.isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    } catch (error) {
      await this.smsProviderRepository.update(providerId, {
        isHealthy: false,
        lastHealthCheck: new Date(),
        status: SmsProviderStatus.ERROR,
        lastError: error.message,
      });

      this.logger.error(`Health check failed for ${provider.name}: ${error.message}`);
    }
  }

  /**
   * Perform health check on all providers
   */
  async performHealthCheckAll(): Promise<void> {
    const providers = await this.smsProviderRepository.find({
      where: { isActive: true, isEnabled: true },
    });

    this.logger.log(`Performing health check on ${providers.length} providers`);

    const healthCheckPromises = providers.map(provider => 
      this.performHealthCheck(provider.id).catch(error => 
        this.logger.error(`Health check failed for ${provider.name}: ${error.message}`)
      )
    );

    await Promise.all(healthCheckPromises);
  }

  /**
   * Get SMS logs
   */
  async getSmsLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      providerId?: string;
      status?: SmsStatus;
      type?: SmsType;
      recipient?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ logs: SmsLog[]; total: number; page: number; limit: number }> {
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

  /**
   * Get SMS statistics
   */
  async getSmsStatistics(): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    deliveryRate: number;
    totalCost: number;
    providerStats: Array<{
      providerId: string;
      providerName: string;
      totalSent: number;
      totalDelivered: number;
      deliveryRate: number;
      totalCost: number;
    }>;
  }> {
    const totalStats = await this.smsLogRepository
      .createQueryBuilder('log')
      .select([
        'COUNT(*) as totalSent',
        'COUNT(CASE WHEN status = :delivered THEN 1 END) as totalDelivered',
        'COUNT(CASE WHEN status = :failed THEN 1 END) as totalFailed',
        'SUM(COALESCE(cost, 0)) as totalCost',
      ])
      .setParameters({
        delivered: SmsStatus.DELIVERED,
        failed: SmsStatus.FAILED,
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
        delivered: SmsStatus.DELIVERED,
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

  /**
   * Activate/deactivate provider
   */
  async toggleProviderStatus(providerId: string, isActive: boolean): Promise<SmsProvider> {
    const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    provider.isActive = isActive;
    provider.status = isActive ? SmsProviderStatus.ACTIVE : SmsProviderStatus.INACTIVE;

    const updatedProvider = await this.smsProviderRepository.save(provider);
    
    this.logger.log(`${isActive ? 'Activated' : 'Deactivated'} SMS provider: ${provider.name}`);
    return updatedProvider;
  }

  /**
   * Update provider priority
   */
  async updateProviderPriority(providerId: string, priority: number): Promise<SmsProvider> {
    const provider = await this.smsProviderRepository.findOne({ where: { id: providerId } });
    
    if (!provider) {
      throw new NotFoundException('SMS provider not found');
    }

    provider.priority = priority;
    const updatedProvider = await this.smsProviderRepository.save(provider);

    this.logger.log(`Updated priority for SMS provider ${provider.name} to ${priority}`);
    return updatedProvider;
  }
}
