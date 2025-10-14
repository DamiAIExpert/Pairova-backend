import { Repository } from 'typeorm';
import { StorageProvider } from '../entities/storage-provider.entity';
import { StorageProviderFactoryService } from './storage-provider-factory.service';
import { CreateStorageProviderDto, UpdateStorageProviderDto } from '../dto/storage-provider.dto';
export declare class StorageProviderService {
    private readonly storageProviderRepository;
    private readonly storageProviderFactory;
    private readonly logger;
    constructor(storageProviderRepository: Repository<StorageProvider>, storageProviderFactory: StorageProviderFactoryService);
    getAllProviders(): Promise<StorageProvider[]>;
    getProviderById(id: string): Promise<StorageProvider>;
    getActiveProviders(): Promise<StorageProvider[]>;
    createProvider(createDto: CreateStorageProviderDto, userId: string): Promise<StorageProvider>;
    updateProvider(id: string, updateDto: UpdateStorageProviderDto, userId: string): Promise<StorageProvider>;
    deleteProvider(id: string): Promise<void>;
    activateProvider(id: string): Promise<StorageProvider>;
    deactivateProvider(id: string): Promise<StorageProvider>;
    updateProviderPriority(id: string, priority: number): Promise<StorageProvider>;
    updateProviderHealth(id: string, isHealthy: boolean, error?: string): Promise<StorageProvider>;
    getProviderUsage(id: string): Promise<{
        usageCount: number;
        totalStorageUsed: number;
        averageFileSize: number;
        fileCount: number;
    }>;
    getBestProvider(): Promise<StorageProvider | null>;
    switchToProvider(id: string): Promise<StorageProvider>;
}
