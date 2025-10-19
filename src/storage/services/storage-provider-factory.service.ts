// src/storage/services/storage-provider-factory.service.ts
import { Injectable } from '@nestjs/common';
import { StorageType } from '../../common/enums/storage-type.enum';
import { StorageProviderInterface } from '../interfaces/storage-provider.interface';
import { CloudinaryStorageService } from './cloudinary-storage.service';
import { AwsS3StorageService } from './aws-s3-storage.service';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { 
  CloudinaryConfigDto, 
  AwsS3ConfigDto, 
  GoogleCloudConfigDto,
  AzureBlobConfigDto,
  LocalConfigDto 
} from '../dto/storage-provider.dto';

@Injectable()
export class StorageProviderFactoryService {
  private providers: Map<string, StorageProviderInterface> = new Map();

  createProvider(type: StorageType, configuration: any): StorageProviderInterface {
    let provider: StorageProviderInterface;

    switch (type) {
      case StorageType.CLOUDINARY:
        provider = new CloudinaryStorageService();
        // provider.initialize(configuration as CloudinaryConfigDto);
        break;

      case StorageType.AWS_S3:
        provider = new AwsS3StorageService();
        // provider.initialize(configuration as AwsS3ConfigDto);
        break;

      case StorageType.GOOGLE_CLOUD_STORAGE:
        provider = new GoogleCloudStorageService();
        // provider.initialize(configuration as GoogleCloudConfigDto);
        break;

      case StorageType.AZURE_BLOB:
        // TODO: Implement Azure Blob Storage service
        throw new Error('Azure Blob Storage not implemented yet');

      case StorageType.LOCAL:
        // TODO: Implement Local Storage service
        throw new Error('Local Storage not implemented yet');

      default:
        throw new Error(`Unsupported storage type: ${type}`);
    }

    return provider;
  }

  getProvider(type: StorageType, configuration: any): StorageProviderInterface {
    const key = `${type}_${JSON.stringify(configuration)}`;
    
    if (!this.providers.has(key)) {
      const provider = this.createProvider(type, configuration);
      this.providers.set(key, provider);
    }

    return this.providers.get(key);
  }

  clearCache(): void {
    this.providers.clear();
  }

  validateConfiguration(type: StorageType, configuration: any): boolean {
    try {
      switch (type) {
        case StorageType.CLOUDINARY:
          return this.validateCloudinaryConfig(configuration);
        
        case StorageType.AWS_S3:
          return this.validateAwsS3Config(configuration);
        
        case StorageType.GOOGLE_CLOUD_STORAGE:
          return this.validateGoogleCloudConfig(configuration);
        
        case StorageType.AZURE_BLOB:
          return this.validateAzureBlobConfig(configuration);
        
        case StorageType.LOCAL:
          return this.validateLocalConfig(configuration);
        
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  private validateCloudinaryConfig(config: any): boolean {
    return config && 
           typeof config.cloudName === 'string' && 
           typeof config.apiKey === 'string' && 
           typeof config.apiSecret === 'string';
  }

  private validateAwsS3Config(config: any): boolean {
    return config && 
           typeof config.bucketName === 'string' && 
           typeof config.accessKeyId === 'string' && 
           typeof config.secretAccessKey === 'string';
  }

  private validateGoogleCloudConfig(config: any): boolean {
    try {
      return config && 
             typeof config.projectId === 'string' && 
             typeof config.bucketName === 'string' && 
             typeof config.serviceAccountKey === 'string' &&
             JSON.parse(config.serviceAccountKey);
    } catch (error) {
      return false;
    }
  }

  private validateAzureBlobConfig(config: any): boolean {
    return config && 
           typeof config.accountName === 'string' && 
           typeof config.accountKey === 'string' && 
           typeof config.containerName === 'string';
  }

  private validateLocalConfig(config: any): boolean {
    return config && 
           typeof config.uploadPath === 'string' && 
           typeof config.baseUrl === 'string';
  }

  getSupportedTypes(): StorageType[] {
    return [
      StorageType.CLOUDINARY,
      StorageType.AWS_S3,
      StorageType.GOOGLE_CLOUD_STORAGE,
      // StorageType.AZURE_BLOB, // TODO: Implement
      // StorageType.LOCAL, // TODO: Implement
    ];
  }

  getTypeDescription(type: StorageType): string {
    switch (type) {
      case StorageType.CLOUDINARY:
        return 'Cloud-based image and video management service with built-in transformations';
      case StorageType.AWS_S3:
        return 'Amazon Simple Storage Service - scalable object storage';
      case StorageType.GOOGLE_CLOUD_STORAGE:
        return 'Google Cloud Storage - unified object storage for developers';
      case StorageType.AZURE_BLOB:
        return 'Microsoft Azure Blob Storage - cloud storage solution';
      case StorageType.LOCAL:
        return 'Local file system storage';
      default:
        return 'Unknown storage type';
    }
  }
}
