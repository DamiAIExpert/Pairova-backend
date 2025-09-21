// src/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageProvider } from './entities/storage-provider.entity';
import { FileUpload } from './entities/file-upload.entity';
import { StorageProviderService } from './services/storage-provider.service';
import { FileStorageService } from './services/file-storage.service';
import { StorageProviderFactoryService } from './services/storage-provider-factory.service';
import { CloudinaryStorageService } from './services/cloudinary-storage.service';
import { AwsS3StorageService } from './services/aws-s3-storage.service';
import { GoogleCloudStorageService } from './services/google-cloud-storage.service';
import { AdminStorageController } from './controllers/admin-storage.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageProvider, FileUpload]),
  ],
  controllers: [AdminStorageController],
  providers: [
    StorageProviderService,
    FileStorageService,
    StorageProviderFactoryService,
    CloudinaryStorageService,
    AwsS3StorageService,
    GoogleCloudStorageService,
  ],
  exports: [
    StorageProviderService,
    FileStorageService,
    StorageProviderFactoryService,
  ],
})
export class StorageModule {}
