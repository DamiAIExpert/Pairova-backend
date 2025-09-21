// src/storage/services/file-storage.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageProvider } from '../entities/storage-provider.entity';
import { FileUpload } from '../entities/file-upload.entity';
import { StorageProviderFactoryService } from './storage-provider-factory.service';
import { StorageType } from '../../common/enums/storage-type.enum';
import { FileType } from '../../common/enums/file-type.enum';
import { UploadOptions } from '../interfaces/storage-provider.interface';
import { User } from '../../users/shared/user.entity';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);

  constructor(
    @InjectRepository(StorageProvider)
    private readonly storageProviderRepository: Repository<StorageProvider>,
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
    private readonly storageProviderFactory: StorageProviderFactoryService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    fileType: FileType = FileType.OTHER,
    options: UploadOptions = {},
  ): Promise<FileUpload> {
    try {
      // Get the best available storage provider
      const provider = await this.getBestStorageProvider();
      if (!provider) {
        throw new BadRequestException('No active storage providers available');
      }

      // Validate file
      this.validateFile(file);

      // Upload file using the provider
      const storageService = this.storageProviderFactory.getProvider(
        provider.type,
        provider.configuration,
      );

      const uploadResult = await storageService.upload(file, options);

      // Save file record to database
      const fileUpload = this.fileUploadRepository.create({
        filename: file.filename || file.originalname,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: uploadResult.size,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        fileType,
        folder: options.folder,
        metadata: {
          ...uploadResult.metadata,
          ...options.metadata,
        },
        publicId: uploadResult.publicId,
        isPublic: options.isPublic || false,
        userId,
        storageProviderId: provider.id,
      });

      const savedFile = await this.fileUploadRepository.save(fileUpload);

      // Update provider usage statistics
      await this.updateProviderUsage(provider.id, uploadResult.size);

      this.logger.log(`File uploaded successfully: ${savedFile.id} via ${provider.name}`);
      return savedFile;
    } catch (error) {
      this.logger.error(`File upload failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      const file = await this.fileUploadRepository.findOne({
        where: { id: fileId, userId },
        relations: ['storageProvider'],
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Delete from storage provider
      const storageService = this.storageProviderFactory.getProvider(
        file.storageProvider.type,
        file.storageProvider.configuration,
      );

      await storageService.delete(file.publicId);

      // Mark as deleted in database
      file.deletedAt = new Date();
      await this.fileUploadRepository.save(file);

      // Update provider usage statistics
      await this.updateProviderUsage(file.storageProvider.id, -file.size);

      this.logger.log(`File deleted successfully: ${fileId}`);
      return true;
    } catch (error) {
      this.logger.error(`File deletion failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFile(fileId: string, userId?: string): Promise<FileUpload> {
    const where: any = { id: fileId };
    if (userId) {
      where.userId = userId;
    }

    const file = await this.fileUploadRepository.findOne({
      where,
      relations: ['storageProvider', 'user'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async getUserFiles(
    userId: string,
    fileType?: FileType,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ files: FileUpload[]; total: number }> {
    const query = this.fileUploadRepository.createQueryBuilder('file')
      .where('file.userId = :userId', { userId })
      .andWhere('file.deletedAt IS NULL')
      .orderBy('file.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    if (fileType) {
      query.andWhere('file.fileType = :fileType', { fileType });
    }

    const [files, total] = await query.getManyAndCount();
    return { files, total };
  }

  async getBestStorageProvider(): Promise<StorageProvider | null> {
    const providers = await this.storageProviderRepository.find({
      where: { isActive: true, isHealthy: true },
      order: { priority: 'ASC' },
    });

    if (providers.length === 0) {
      return null;
    }

    // Return the provider with highest priority (lowest number)
    return providers[0];
  }

  async getAllStorageProviders(): Promise<StorageProvider[]> {
    return this.storageProviderRepository.find({
      order: { priority: 'ASC' },
    });
  }

  async performHealthCheck(providerId?: string): Promise<void> {
    const where: any = {};
    if (providerId) {
      where.id = providerId;
    }

    const providers = await this.storageProviderRepository.find({ where });

    for (const provider of providers) {
      try {
        const storageService = this.storageProviderFactory.getProvider(
          provider.type,
          provider.configuration,
        );

        const healthStatus = await storageService.healthCheck();

        provider.isHealthy = healthStatus.isHealthy;
        provider.lastHealthCheck = new Date();
        provider.healthCheckError = healthStatus.error || null;

        await this.storageProviderRepository.save(provider);

        this.logger.log(`Health check completed for ${provider.name}: ${healthStatus.isHealthy ? 'healthy' : 'unhealthy'}`);
      } catch (error) {
        this.logger.error(`Health check failed for ${provider.name}: ${error.message}`);
        
        provider.isHealthy = false;
        provider.lastHealthCheck = new Date();
        provider.healthCheckError = error.message;

        await this.storageProviderRepository.save(provider);
      }
    }
  }

  async getStorageUsage(): Promise<{
    totalFiles: number;
    totalStorage: number;
    providers: Array<{
      id: string;
      name: string;
      type: StorageType;
      usageCount: number;
      totalStorageUsed: number;
      isHealthy: boolean;
    }>;
  }> {
    const providers = await this.getAllStorageProviders();
    const stats = await this.fileUploadRepository
      .createQueryBuilder('file')
      .select([
        'COUNT(*) as totalFiles',
        'SUM(file.size) as totalStorage',
      ])
      .where('file.deletedAt IS NULL')
      .getRawOne();

    return {
      totalFiles: parseInt(stats.totalFiles) || 0,
      totalStorage: parseInt(stats.totalStorage) || 0,
      providers: providers.map(provider => ({
        id: provider.id,
        name: provider.name,
        type: provider.type,
        usageCount: provider.usageCount,
        totalStorageUsed: provider.totalStorageUsed,
        isHealthy: provider.isHealthy,
      })),
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Check file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
  }

  private async updateProviderUsage(providerId: string, sizeChange: number): Promise<void> {
    await this.storageProviderRepository
      .createQueryBuilder()
      .update(StorageProvider)
      .set({
        usageCount: () => 'usageCount + 1',
        totalStorageUsed: () => `totalStorageUsed + ${sizeChange}`,
      })
      .where('id = :id', { id: providerId })
      .execute();
  }

  async generateSignedUrl(fileId: string, userId?: string, expiresIn: number = 3600): Promise<string> {
    const file = await this.getFile(fileId, userId);
    
    const storageService = this.storageProviderFactory.getProvider(
      file.storageProvider.type,
      file.storageProvider.configuration,
    );

    return storageService.generateUrl(file.publicId);
  }
}
