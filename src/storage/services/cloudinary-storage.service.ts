// src/storage/services/cloudinary-storage.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { CloudinaryConfigDto } from '../dto/storage-provider.dto';

@Injectable()
export class CloudinaryStorageService implements StorageProviderInterface {
  private config: CloudinaryConfigDto;

  constructor() {}

  initialize(config: CloudinaryConfigDto): void {
    this.config = config;
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
  }

  async upload(file: Express.Multer.File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const folder = options.folder || this.config.defaultFolder || 'pairova';
      const publicId = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: folder,
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            ...options.transformations,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      const result = uploadResult as any;
      
      return {
        url: result.secure_url,
        thumbnailUrl: this.generateThumbnailUrl(result.public_id),
        publicId: result.public_id,
        size: result.bytes,
        metadata: {
          format: result.format,
          width: result.width,
          height: result.height,
          resource_type: result.resource_type,
        },
      };
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  generateUrl(publicId: string, transformations: Record<string, any> = {}): string {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...this.config.defaultTransformations,
      ...transformations,
    };
    
    return cloudinary.url(publicId, defaultTransformations);
  }

  generateThumbnailUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  async healthCheck(): Promise<StorageHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test by getting account info
      const result = await cloudinary.api.ping();
      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: true,
        responseTime,
        status: {
          cloudName: this.config.cloudName,
          status: 'connected',
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: false,
        responseTime,
        error: error.message,
        status: {
          cloudName: this.config.cloudName,
          status: 'error',
        },
      };
    }
  }

  async getUsage(): Promise<StorageUsageInfo> {
    try {
      const usage = await cloudinary.api.usage();
      
      return {
        totalStorage: usage.used_quota?.storage?.used || 0,
        fileCount: usage.used_quota?.requests?.used || 0,
        bandwidthUsed: usage.used_quota?.bandwidth?.used || 0,
        quota: usage.plan?.quota || null,
        remaining: usage.plan?.quota ? usage.plan.quota - (usage.used_quota?.storage?.used || 0) : null,
      };
    } catch (error) {
      throw new Error(`Failed to get Cloudinary usage: ${error.message}`);
    }
  }
}
