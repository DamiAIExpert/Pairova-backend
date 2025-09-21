// src/storage/services/aws-s3-storage.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { AwsS3ConfigDto } from '../dto/storage-provider.dto';

@Injectable()
export class AwsS3StorageService implements StorageProviderInterface {
  private s3Client: S3Client;
  private config: AwsS3ConfigDto;

  constructor() {}

  initialize(config: AwsS3ConfigDto): void {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region || 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
    });
  }

  async upload(file: Express.Multer.File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const folder = options.folder || this.config.defaultFolder || 'pairova';
      const key = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
      
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: options.isPublic ? 'public-read' : 'private',
        Metadata: {
          originalName: file.originalname,
          ...options.metadata,
        },
      });

      await this.s3Client.send(command);
      
      const url = this.generateUrl(key);
      
      return {
        url,
        publicId: key,
        size: file.size,
        metadata: {
          bucket: this.config.bucketName,
          key,
          contentType: file.mimetype,
        },
      };
    } catch (error) {
      throw new Error(`AWS S3 upload failed: ${error.message}`);
    }
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: publicId,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      throw new Error(`AWS S3 delete failed: ${error.message}`);
    }
  }

  generateUrl(publicId: string, transformations: Record<string, any> = {}): string {
    if (this.config.endpoint) {
      // Custom endpoint (e.g., DigitalOcean Spaces, MinIO)
      return `${this.config.endpoint}/${this.config.bucketName}/${publicId}`;
    }
    
    // Standard AWS S3 URL
    return `https://${this.config.bucketName}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${publicId}`;
  }

  async healthCheck(): Promise<StorageHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test by checking bucket access
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: 'health-check-test',
      });

      try {
        await this.s3Client.send(command);
      } catch (error) {
        // 404 is expected for health check
        if (error.name !== 'NotFound') {
          throw error;
        }
      }

      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: true,
        responseTime,
        status: {
          bucket: this.config.bucketName,
          region: this.config.region,
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
          bucket: this.config.bucketName,
          region: this.config.region,
          status: 'error',
        },
      };
    }
  }

  async getUsage(): Promise<StorageUsageInfo> {
    // AWS S3 doesn't provide usage info through SDK
    // This would need to be implemented using CloudWatch or AWS CLI
    return {
      totalStorage: 0,
      fileCount: 0,
      bandwidthUsed: 0,
    };
  }
}
