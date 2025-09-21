// src/storage/services/storage-provider.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageProvider } from '../entities/storage-provider.entity';
import { StorageProviderFactoryService } from './storage-provider-factory.service';
import { CreateStorageProviderDto, UpdateStorageProviderDto } from '../dto/storage-provider.dto';
import { StorageType } from '../../common/enums/storage-type.enum';

@Injectable()
export class StorageProviderService {
  private readonly logger = new Logger(StorageProviderService.name);

  constructor(
    @InjectRepository(StorageProvider)
    private readonly storageProviderRepository: Repository<StorageProvider>,
    private readonly storageProviderFactory: StorageProviderFactoryService,
  ) {}

  async getAllProviders(): Promise<StorageProvider[]> {
    return this.storageProviderRepository.find({
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async getProviderById(id: string): Promise<StorageProvider> {
    const provider = await this.storageProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('Storage provider not found');
    }

    return provider;
  }

  async getActiveProviders(): Promise<StorageProvider[]> {
    return this.storageProviderRepository.find({
      where: { isActive: true, isHealthy: true },
      order: { priority: 'ASC' },
    });
  }

  async createProvider(createDto: CreateStorageProviderDto, userId: string): Promise<StorageProvider> {
    // Validate configuration
    const isValid = this.storageProviderFactory.validateConfiguration(createDto.type, createDto.configuration);
    if (!isValid) {
      throw new BadRequestException('Invalid storage provider configuration');
    }

    // Check if name already exists
    const existingProvider = await this.storageProviderRepository.findOne({
      where: { name: createDto.name },
    });

    if (existingProvider) {
      throw new BadRequestException('Storage provider with this name already exists');
    }

    // Test the configuration
    try {
      const storageService = this.storageProviderFactory.getProvider(createDto.type, createDto.configuration);
      const healthStatus = await storageService.healthCheck();
      
      if (!healthStatus.isHealthy) {
        throw new BadRequestException(`Storage provider health check failed: ${healthStatus.error}`);
      }
    } catch (error) {
      throw new BadRequestException(`Storage provider configuration test failed: ${error.message}`);
    }

    // Create provider
    const provider = this.storageProviderRepository.create({
      name: createDto.name,
      type: createDto.type,
      description: createDto.description,
      priority: createDto.priority,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      configuration: createDto.configuration,
      isHealthy: true,
      lastHealthCheck: new Date(),
      metadata: {
        createdBy: userId,
        createdAt: new Date().toISOString(),
      },
    });

    const savedProvider = await this.storageProviderRepository.save(provider);
    this.logger.log(`Storage provider created: ${savedProvider.id} (${savedProvider.name})`);
    
    return savedProvider;
  }

  async updateProvider(
    id: string,
    updateDto: UpdateStorageProviderDto,
    userId: string,
  ): Promise<StorageProvider> {
    const provider = await this.getProviderById(id);

    // If configuration is being updated, validate it
    if (updateDto.configuration) {
      const isValid = this.storageProviderFactory.validateConfiguration(provider.type, updateDto.configuration);
      if (!isValid) {
        throw new BadRequestException('Invalid storage provider configuration');
      }

      // Test the new configuration
      try {
        const storageService = this.storageProviderFactory.getProvider(provider.type, updateDto.configuration);
        const healthStatus = await storageService.healthCheck();
        
        if (!healthStatus.isHealthy) {
          throw new BadRequestException(`Storage provider health check failed: ${healthStatus.error}`);
        }
      } catch (error) {
        throw new BadRequestException(`Storage provider configuration test failed: ${error.message}`);
      }
    }

    // Update fields
    Object.assign(provider, updateDto);
    
    // Update metadata
    provider.metadata = {
      ...provider.metadata,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    };

    const savedProvider = await this.storageProviderRepository.save(provider);
    this.logger.log(`Storage provider updated: ${savedProvider.id} (${savedProvider.name})`);
    
    return savedProvider;
  }

  async deleteProvider(id: string): Promise<void> {
    const provider = await this.getProviderById(id);

    // Check if provider is in use
    if (provider.usageCount > 0) {
      throw new BadRequestException('Cannot delete storage provider that is currently in use');
    }

    await this.storageProviderRepository.remove(provider);
    this.logger.log(`Storage provider deleted: ${id} (${provider.name})`);
  }

  async activateProvider(id: string): Promise<StorageProvider> {
    const provider = await this.getProviderById(id);
    
    // Test provider before activating
    try {
      const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
      const healthStatus = await storageService.healthCheck();
      
      if (!healthStatus.isHealthy) {
        throw new BadRequestException(`Cannot activate unhealthy storage provider: ${healthStatus.error}`);
      }
      
      provider.isHealthy = true;
      provider.healthCheckError = null;
    } catch (error) {
      throw new BadRequestException(`Storage provider health check failed: ${error.message}`);
    }

    provider.isActive = true;
    provider.lastHealthCheck = new Date();
    
    const savedProvider = await this.storageProviderRepository.save(provider);
    this.logger.log(`Storage provider activated: ${savedProvider.id} (${savedProvider.name})`);
    
    return savedProvider;
  }

  async deactivateProvider(id: string): Promise<StorageProvider> {
    const provider = await this.getProviderById(id);
    provider.isActive = false;
    
    const savedProvider = await this.storageProviderRepository.save(provider);
    this.logger.log(`Storage provider deactivated: ${savedProvider.id} (${savedProvider.name})`);
    
    return savedProvider;
  }

  async updateProviderPriority(id: string, priority: number): Promise<StorageProvider> {
    if (priority < 1 || priority > 100) {
      throw new BadRequestException('Priority must be between 1 and 100');
    }

    const provider = await this.getProviderById(id);
    provider.priority = priority;
    
    const savedProvider = await this.storageProviderRepository.save(provider);
    this.logger.log(`Storage provider priority updated: ${savedProvider.id} (${savedProvider.name}) to ${priority}`);
    
    return savedProvider;
  }

  async updateProviderHealth(
    id: string,
    isHealthy: boolean,
    error?: string,
  ): Promise<StorageProvider> {
    const provider = await this.getProviderById(id);
    provider.isHealthy = isHealthy;
    provider.healthCheckError = error || null;
    provider.lastHealthCheck = new Date();
    
    return this.storageProviderRepository.save(provider);
  }

  async getProviderUsage(id: string): Promise<{
    usageCount: number;
    totalStorageUsed: number;
    averageFileSize: number;
    fileCount: number;
  }> {
    const provider = await this.getProviderById(id);
    
    return {
      usageCount: provider.usageCount,
      totalStorageUsed: provider.totalStorageUsed,
      averageFileSize: provider.usageCount > 0 ? provider.totalStorageUsed / provider.usageCount : 0,
      fileCount: provider.usageCount,
    };
  }

  async getBestProvider(): Promise<StorageProvider | null> {
    const providers = await this.getActiveProviders();
    return providers.length > 0 ? providers[0] : null;
  }

  async switchToProvider(id: string): Promise<StorageProvider> {
    const provider = await this.getProviderById(id);
    
    if (!provider.isActive) {
      throw new BadRequestException('Cannot switch to inactive storage provider');
    }

    if (!provider.isHealthy) {
      throw new BadRequestException('Cannot switch to unhealthy storage provider');
    }

    // Update all other providers to lower priority
    await this.storageProviderRepository
      .createQueryBuilder()
      .update(StorageProvider)
      .set({ priority: () => 'priority + 1' })
      .where('id != :id', { id })
      .execute();

    // Set this provider to highest priority
    provider.priority = 1;
    const savedProvider = await this.storageProviderRepository.save(provider);
    
    this.logger.log(`Switched to storage provider: ${savedProvider.id} (${savedProvider.name})`);
    
    return savedProvider;
  }
}
