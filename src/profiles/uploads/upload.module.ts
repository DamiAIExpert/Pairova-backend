// src/profiles/uploads/upload.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Upload } from './entities/upload.entity';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { SimpleUploadController } from './simple-upload.controller';
import { StorageModule } from '../../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    StorageModule,
  ],
  controllers: [UploadController, SimpleUploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
