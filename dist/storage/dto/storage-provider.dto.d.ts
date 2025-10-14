import { StorageType } from '../../common/enums/storage-type.enum';
export declare class CloudinaryConfigDto {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    defaultFolder?: string;
    defaultTransformations?: Record<string, any>;
}
export declare class AwsS3ConfigDto {
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    region?: string;
    endpoint?: string;
    defaultFolder?: string;
}
export declare class GoogleCloudConfigDto {
    projectId: string;
    bucketName: string;
    serviceAccountKey: string;
    defaultFolder?: string;
}
export declare class AzureBlobConfigDto {
    accountName: string;
    accountKey: string;
    containerName: string;
    defaultFolder?: string;
}
export declare class LocalConfigDto {
    uploadPath: string;
    baseUrl: string;
    maxFileSize?: number;
}
export declare class CreateStorageProviderDto {
    name: string;
    type: StorageType;
    description?: string;
    priority: number;
    isActive?: boolean;
    configuration: CloudinaryConfigDto | AwsS3ConfigDto | GoogleCloudConfigDto | AzureBlobConfigDto | LocalConfigDto;
}
export declare class UpdateStorageProviderDto {
    name?: string;
    description?: string;
    priority?: number;
    isActive?: boolean;
    configuration?: Record<string, any>;
}
export declare class StorageProviderResponseDto {
    id: string;
    name: string;
    type: StorageType;
    isActive: boolean;
    priority: number;
    description: string;
    usageCount: number;
    totalStorageUsed: number;
    isHealthy: boolean;
    lastHealthCheck: Date;
    healthCheckError: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any>;
}
export declare class StorageProviderHealthDto {
    id: string;
    name: string;
    type: StorageType;
    isHealthy: boolean;
    responseTime: number;
    error: string;
    checkedAt: Date;
    status: Record<string, any>;
}
export declare class FileUploadDto {
    file: Express.Multer.File;
    fileType?: string;
    folder?: string;
    isPublic?: boolean;
    metadata?: Record<string, any>;
}
export declare class FileUploadResponseDto {
    id: string;
    url: string;
    thumbnailUrl: string;
    size: number;
    mimeType: string;
    fileType: string;
    storageProvider: string;
    uploadedAt: Date;
}
