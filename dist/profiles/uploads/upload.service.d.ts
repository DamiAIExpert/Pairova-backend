import { Repository } from 'typeorm';
import { FileStorageService } from '../../storage/services/file-storage.service';
import { FileType } from '../../common/enums/file-type.enum';
import { Upload } from './entities/upload.entity';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';
export declare class UploadService {
    private readonly uploadsRepo;
    private readonly fileStorageService;
    constructor(uploadsRepo: Repository<Upload>, fileStorageService: FileStorageService);
    processAndRecordUpload(file: Express.Multer.File, user: User, kind?: string, fileType?: FileType): Promise<UploadDto>;
    listUserUploads(userId: string, kind?: string): Promise<UploadDto[]>;
    private mapKindToFileType;
    deleteUpload(uploadId: string, userId: string): Promise<boolean>;
    getUserUploadStats(userId: string): Promise<{
        totalUploads: number;
        totalSize: number;
        uploadsByKind: Record<string, number>;
    }>;
}
