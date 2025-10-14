import { Repository } from 'typeorm';
import { StorageProvider } from '../entities/storage-provider.entity';
import { FileUpload } from '../entities/file-upload.entity';
import { StorageProviderFactoryService } from './storage-provider-factory.service';
import { StorageType } from '../../common/enums/storage-type.enum';
import { FileType } from '../../common/enums/file-type.enum';
import { UploadOptions } from '../interfaces/storage-provider.interface';
export declare class FileStorageService {
    private readonly storageProviderRepository;
    private readonly fileUploadRepository;
    private readonly storageProviderFactory;
    private readonly logger;
    constructor(storageProviderRepository: Repository<StorageProvider>, fileUploadRepository: Repository<FileUpload>, storageProviderFactory: StorageProviderFactoryService);
    uploadFile(file: Express.Multer.File, userId: string, fileType?: FileType, options?: UploadOptions): Promise<FileUpload>;
    deleteFile(fileId: string, userId: string): Promise<boolean>;
    getFile(fileId: string, userId?: string): Promise<FileUpload>;
    getUserFiles(userId: string, fileType?: FileType, limit?: number, offset?: number): Promise<{
        files: FileUpload[];
        total: number;
    }>;
    getBestStorageProvider(): Promise<StorageProvider | null>;
    getAllStorageProviders(): Promise<StorageProvider[]>;
    performHealthCheck(providerId?: string): Promise<void>;
    getStorageUsage(): Promise<{
        totalFiles: number;
        totalStorage: number;
        providers: Array<{
            id: string;
            name: string;
            type: StorageType;
            usageCount: number;
            totalStorageUsed: number;
            isHealthy: boolean;
        }>;
    }>;
    private validateFile;
    private updateProviderUsage;
    generateSignedUrl(fileId: string, userId?: string, expiresIn?: number): Promise<string>;
}
