import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileStorageService } from '../../storage/services/file-storage.service';
import { FileType } from '../../common/enums/file-type.enum';
import { Upload } from './entities/upload.entity';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadsRepo: Repository<Upload>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Handles a single file upload for a user using dynamic storage:
   * 1) Uploads to configured storage provider
   * 2) Persists metadata to DB
   * 3) Returns a normalized DTO
   */
  async processAndRecordUpload(
    file: Express.Multer.File,
    user: User,
    kind: string = 'general',
    fileType?: FileType,
  ): Promise<UploadDto> {
    console.log('🔍 [UploadService] Starting upload process...');
    console.log(`📦 File: ${file?.originalname}, Size: ${file?.size}, Type: ${file?.mimetype}`);
    console.log(`👤 User: ${user?.id}, Kind: ${kind}`);
    
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!user?.id) {
      throw new BadRequestException('Missing authenticated user');
    }

    // Determine file type based on kind or provided fileType
    const resolvedFileType = fileType || this.mapKindToFileType(kind);
    console.log(`📁 Resolved file type: ${resolvedFileType}`);

    // Upload using dynamic storage service
    console.log('⬆️  Calling fileStorageService.uploadFile...');
    const uploadedFile = await this.fileStorageService.uploadFile(
      file,
      user.id,
      resolvedFileType,
      {
        folder: `pairova/${kind}`,
        isPublic: false,
        metadata: { kind, originalUpload: true },
      },
    );
    console.log('✅ File uploaded to storage:', uploadedFile.url);

    // Also persist to legacy uploads table for backward compatibility
    const record = this.uploadsRepo.create({
      userId: user.id,
      kind,
      fileUrl: uploadedFile.url,
      publicId: uploadedFile.publicId || uploadedFile.id,
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

  /**
   * Maps legacy kind strings to FileType enum values
   */
  private mapKindToFileType(kind: string): FileType {
    switch (kind.toLowerCase()) {
      case 'avatar':
      case 'profile':
        return FileType.PROFILE_PICTURE;
      case 'resume':
      case 'cv':
        return FileType.RESUME;
      case 'cover-letter':
        return FileType.COVER_LETTER;
      case 'certificate':
        return FileType.CERTIFICATE;
      case 'logo':
        return FileType.COMPANY_LOGO;
      case 'ngo-logo':
        return FileType.NGO_LOGO;
      case 'image':
      case 'photo':
        return FileType.IMAGE;
      case 'document':
      case 'doc':
        return FileType.DOCUMENT;
      default:
        return FileType.OTHER;
    }
  }

  /**
   * Delete an uploaded file from storage and database
   */
  async deleteUpload(uploadId: string, userId: string): Promise<boolean> {
    // Get the upload record
    const upload = await this.uploadsRepo.findOne({
      where: { id: uploadId, userId },
    });

    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    // Delete from dynamic storage (this will also update the file_uploads table)
    await this.fileStorageService.deleteFile(uploadId, userId);

    // Delete from legacy uploads table
    await this.uploadsRepo.remove(upload);

    return true;
  }

  /**
   * Get upload statistics for a user
   */
  async getUserUploadStats(userId: string): Promise<{
    totalUploads: number;
    totalSize: number;
    uploadsByKind: Record<string, number>;
  }> {
    const uploads = await this.uploadsRepo.find({ where: { userId } });
    
    const stats = {
      totalUploads: uploads.length,
      totalSize: uploads.reduce((sum, upload) => sum + upload.sizeBytes, 0),
      uploadsByKind: {} as Record<string, number>,
    };

    uploads.forEach(upload => {
      stats.uploadsByKind[upload.kind] = (stats.uploadsByKind[upload.kind] || 0) + 1;
    });

    return stats;
  }
}
