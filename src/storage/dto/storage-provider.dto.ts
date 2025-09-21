// src/storage/dto/storage-provider.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsNumber, IsOptional, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StorageType } from '../../common/enums/storage-type.enum';

export class CloudinaryConfigDto {
  @ApiProperty({ description: 'Cloudinary cloud name' })
  @IsString()
  cloudName: string;

  @ApiProperty({ description: 'Cloudinary API key' })
  @IsString()
  apiKey: string;

  @ApiProperty({ description: 'Cloudinary API secret' })
  @IsString()
  apiSecret: string;

  @ApiProperty({ description: 'Default folder for uploads', required: false })
  @IsString()
  @IsOptional()
  defaultFolder?: string;

  @ApiProperty({ description: 'Default transformation settings', required: false })
  @IsObject()
  @IsOptional()
  defaultTransformations?: Record<string, any>;
}

export class AwsS3ConfigDto {
  @ApiProperty({ description: 'AWS S3 bucket name' })
  @IsString()
  bucketName: string;

  @ApiProperty({ description: 'AWS access key ID' })
  @IsString()
  accessKeyId: string;

  @ApiProperty({ description: 'AWS secret access key' })
  @IsString()
  secretAccessKey: string;

  @ApiProperty({ description: 'AWS region', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ description: 'S3 endpoint URL', required: false })
  @IsString()
  @IsOptional()
  endpoint?: string;

  @ApiProperty({ description: 'Default folder for uploads', required: false })
  @IsString()
  @IsOptional()
  defaultFolder?: string;
}

export class GoogleCloudConfigDto {
  @ApiProperty({ description: 'Google Cloud project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Google Cloud Storage bucket name' })
  @IsString()
  bucketName: string;

  @ApiProperty({ description: 'Google Cloud service account key (JSON)' })
  @IsString()
  serviceAccountKey: string;

  @ApiProperty({ description: 'Default folder for uploads', required: false })
  @IsString()
  @IsOptional()
  defaultFolder?: string;
}

export class AzureBlobConfigDto {
  @ApiProperty({ description: 'Azure storage account name' })
  @IsString()
  accountName: string;

  @ApiProperty({ description: 'Azure storage account key' })
  @IsString()
  accountKey: string;

  @ApiProperty({ description: 'Azure container name' })
  @IsString()
  containerName: string;

  @ApiProperty({ description: 'Default folder for uploads', required: false })
  @IsString()
  @IsOptional()
  defaultFolder?: string;
}

export class LocalConfigDto {
  @ApiProperty({ description: 'Local storage directory path' })
  @IsString()
  uploadPath: string;

  @ApiProperty({ description: 'Base URL for serving files' })
  @IsString()
  baseUrl: string;

  @ApiProperty({ description: 'Maximum file size in bytes', required: false })
  @IsNumber()
  @IsOptional()
  maxFileSize?: number;
}

export class CreateStorageProviderDto {
  @ApiProperty({ description: 'Provider name', example: 'Cloudinary Production' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Storage type', enum: StorageType })
  @IsEnum(StorageType)
  type: StorageType;

  @ApiProperty({ description: 'Provider description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Priority order (lower number = higher priority)', minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  priority: number;

  @ApiProperty({ description: 'Whether this provider is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Provider configuration', 
    oneOf: [
      { $ref: '#/components/schemas/CloudinaryConfigDto' },
      { $ref: '#/components/schemas/AwsS3ConfigDto' },
      { $ref: '#/components/schemas/GoogleCloudConfigDto' },
      { $ref: '#/components/schemas/AzureBlobConfigDto' },
      { $ref: '#/components/schemas/LocalConfigDto' }
    ]
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  configuration: CloudinaryConfigDto | AwsS3ConfigDto | GoogleCloudConfigDto | AzureBlobConfigDto | LocalConfigDto;
}

export class UpdateStorageProviderDto {
  @ApiProperty({ description: 'Provider name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Provider description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Priority order', minimum: 1, maximum: 100, required: false })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  priority?: number;

  @ApiProperty({ description: 'Whether this provider is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Provider configuration', required: false })
  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;
}

export class StorageProviderResponseDto {
  @ApiProperty({ description: 'Provider ID' })
  id: string;

  @ApiProperty({ description: 'Provider name' })
  name: string;

  @ApiProperty({ description: 'Storage type', enum: StorageType })
  type: StorageType;

  @ApiProperty({ description: 'Whether this provider is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Priority order' })
  priority: number;

  @ApiProperty({ description: 'Provider description' })
  description: string;

  @ApiProperty({ description: 'Usage count' })
  usageCount: number;

  @ApiProperty({ description: 'Total storage used in bytes' })
  totalStorageUsed: number;

  @ApiProperty({ description: 'Whether provider is healthy' })
  isHealthy: boolean;

  @ApiProperty({ description: 'Last health check timestamp' })
  lastHealthCheck: Date;

  @ApiProperty({ description: 'Health check error message' })
  healthCheckError: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Provider metadata' })
  metadata: Record<string, any>;
}

export class StorageProviderHealthDto {
  @ApiProperty({ description: 'Provider ID' })
  id: string;

  @ApiProperty({ description: 'Provider name' })
  name: string;

  @ApiProperty({ description: 'Storage type', enum: StorageType })
  type: StorageType;

  @ApiProperty({ description: 'Whether provider is healthy' })
  isHealthy: boolean;

  @ApiProperty({ description: 'Health check response time in ms' })
  responseTime: number;

  @ApiProperty({ description: 'Health check error message' })
  error: string;

  @ApiProperty({ description: 'Health check timestamp' })
  checkedAt: Date;

  @ApiProperty({ description: 'Provider status details' })
  status: Record<string, any>;
}

export class FileUploadDto {
  @ApiProperty({ description: 'File to upload', type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({ description: 'File type', required: false })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiProperty({ description: 'Folder path', required: false })
  @IsString()
  @IsOptional()
  folder?: string;

  @ApiProperty({ description: 'Whether file should be public', required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'File ID' })
  id: string;

  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  thumbnailUrl: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'File type' })
  fileType: string;

  @ApiProperty({ description: 'Storage provider used' })
  storageProvider: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: Date;
}
