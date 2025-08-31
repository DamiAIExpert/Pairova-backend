import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { uploadToCloudinary } from './cloudinary.storage';
import { Upload } from './entities/upload.entity';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadsRepo: Repository<Upload>,
  ) {}

  /**
   * Handles a single file upload for a user:
   * 1) Uploads to Cloudinary (buffer streaming)
   * 2) Persists metadata to DB
   * 3) Returns a normalized DTO
   */
  async processAndRecordUpload(
    file: Express.Multer.File,
    user: User,
    kind: string = 'general',
  ): Promise<UploadDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!user?.id) {
      throw new BadRequestException('Missing authenticated user');
    }

    // Stream buffer to Cloudinary. Folder: pairova/<kind>
    const uploaded = await uploadToCloudinary(file, {
      folder: `pairova/${kind}`,
      resource_type: 'auto',
    });

    // Persist record
    const record = this.uploadsRepo.create({
      userId: user.id,
      kind,
      fileUrl: uploaded.url,
      publicId: uploaded.publicId,
      mimeType: file.mimetype,
      sizeBytes: file.size ?? 0,
    });
    const saved = await this.uploadsRepo.save(record);

    // Map to DTO
    const dto: UploadDto = {
      id: saved.id,
      url: saved.fileUrl,
      publicId: saved.publicId,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
    };

    return dto;
  }

  /**
   * Optional helper to list a user's uploads by kind (e.g., 'avatar', 'resume')
   */
  async listUserUploads(userId: string, kind?: string): Promise<UploadDto[]> {
    const where = kind ? { userId, kind } : { userId };
    const rows = await this.uploadsRepo.find({ where, order: { createdAt: 'DESC' } });
    return rows.map((u) => ({
      id: u.id,
      url: u.fileUrl,
      publicId: u.publicId,
      mimeType: u.mimeType,
      sizeBytes: u.sizeBytes,
    }));
  }
}
