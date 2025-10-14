import { User } from '../../users/shared/user.entity';
import { StorageProviderService } from '../services/storage-provider.service';
import { FileStorageService } from '../services/file-storage.service';
import { StorageProviderFactoryService } from '../services/storage-provider-factory.service';
import { CreateStorageProviderDto, UpdateStorageProviderDto, StorageProviderResponseDto, StorageProviderHealthDto, FileUploadDto, FileUploadResponseDto } from '../dto/storage-provider.dto';
import { FileType } from '../../common/enums/file-type.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class AdminStorageController {
    private readonly storageProviderService;
    private readonly fileStorageService;
    private readonly storageProviderFactory;
    constructor(storageProviderService: StorageProviderService, fileStorageService: FileStorageService, storageProviderFactory: StorageProviderFactoryService);
    getStorageProviders(): Promise<StorageProviderResponseDto[]>;
    getStorageProvider(id: string): Promise<StorageProviderResponseDto>;
    createStorageProvider(createDto: CreateStorageProviderDto, user: User): Promise<StorageProviderResponseDto>;
    updateStorageProvider(id: string, updateDto: UpdateStorageProviderDto, user: User): Promise<StorageProviderResponseDto>;
    deleteStorageProvider(id: string): Promise<void>;
    testStorageProvider(id: string): Promise<StorageProviderHealthDto>;
    performHealthCheck(id: string): Promise<void>;
    performHealthCheckAll(): Promise<void>;
    getStorageUsage(): Promise<{
        totalFiles: number;
        totalStorage: number;
        providers: Array<{
            id: string;
            name: string;
            type: import("../../common/enums/storage-type.enum").StorageType;
            usageCount: number;
            totalStorageUsed: number;
            isHealthy: boolean;
        }>;
    }>;
    getSupportedStorageTypes(): Promise<{
        type: import("../../common/enums/storage-type.enum").StorageType;
        description: string;
    }[]>;
    getFiles(paginationDto: PaginationDto, fileType?: FileType, userId?: string): Promise<{
        message: string;
        pagination: PaginationDto;
        filters: {
            fileType: FileType;
            userId: string;
        };
    }>;
    testUpload(file: Express.Multer.File, uploadDto: FileUploadDto, user: User): Promise<FileUploadResponseDto>;
    activateProvider(id: string): Promise<StorageProviderResponseDto>;
    deactivateProvider(id: string): Promise<StorageProviderResponseDto>;
    updateProviderPriority(id: string, priority: number): Promise<StorageProviderResponseDto>;
    private mapToResponseDto;
}
