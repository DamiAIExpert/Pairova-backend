// src/storage/services/google-cloud-storage.service.ts
import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { GoogleCloudConfigDto } from '../dto/storage-provider.dto';

@Injectable()
export class GoogleCloudStorageService implements StorageProviderInterface {
  private storage: Storage;
  private config: GoogleCloudConfigDto;

  constructor() {}

  initialize(config: GoogleCloudConfigDto): void {
    this.config = config;
    
    const serviceAccount = JSON.parse(config.serviceAccountKey);
    this.storage = new Storage({
      projectId: config.projectId,
      credentials: serviceAccount,
    });
  }

  async upload(file: Express.Multer.File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const folder = options.folder || this.config.defaultFolder || 'pairova';
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
      
      const bucket = this.storage.bucket(this.config.bucketName);
      const fileUpload = bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            ...options.metadata,
          },
        },
        public: options.isPublic || false,
        resumable: false,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          reject(new Error(`Google Cloud Storage upload failed: ${error.message}`));
        });

        stream.on('finish', async () => {
          try {
            const [url] = await fileUpload.getSignedUrl({
              action: 'read',
              expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
            });

            const [metadata] = await fileUpload.getMetadata();
            
            resolve({
              url: options.isPublic ? fileUpload.publicUrl() : url,
              publicId: fileName,
              size: parseInt(metadata.size.toString()),
              metadata: {
                bucket: this.config.bucketName,
                name: fileName,
                contentType: metadata.contentType,
              },
            });
          } catch (error) {
            reject(new Error(`Failed to get file metadata: ${error.message}`));
          }
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Google Cloud Storage upload failed: ${error.message}`);
    }
  }

  async delete(publicId: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.config.bucketName);
      await bucket.file(publicId).delete();
      return true;
    } catch (error) {
      throw new Error(`Google Cloud Storage delete failed: ${error.message}`);
    }
  }

  generateUrl(publicId: string, transformations: Record<string, any> = {}): string {
    const bucket = this.storage.bucket(this.config.bucketName);
    return `https://storage.googleapis.com/${this.config.bucketName}/${publicId}`;
  }

  async healthCheck(): Promise<StorageHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test by checking bucket access
      const bucket = this.storage.bucket(this.config.bucketName);
      const [exists] = await bucket.exists();
      
      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: exists,
        responseTime,
        status: {
          bucket: this.config.bucketName,
          projectId: this.config.projectId,
          status: exists ? 'connected' : 'bucket_not_found',
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
          projectId: this.config.projectId,
          status: 'error',
        },
      };
    }
  }

  async getUsage(): Promise<StorageUsageInfo> {
    try {
      const bucket = this.storage.bucket(this.config.bucketName);
      const [files] = await bucket.getFiles();
      
      let totalSize = 0;
      for (const file of files) {
        const [metadata] = await file.getMetadata();
        totalSize += parseInt((metadata.size || '0').toString());
      }
      
      return {
        totalStorage: totalSize,
        fileCount: files.length,
        bandwidthUsed: 0, // Not available through API
      };
    } catch (error) {
      throw new Error(`Failed to get Google Cloud Storage usage: ${error.message}`);
    }
  }
}
