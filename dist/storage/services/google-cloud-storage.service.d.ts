import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { GoogleCloudConfigDto } from '../dto/storage-provider.dto';
export declare class GoogleCloudStorageService implements StorageProviderInterface {
    private storage;
    private config;
    constructor();
    initialize(config: GoogleCloudConfigDto): void;
    upload(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult>;
    delete(publicId: string): Promise<boolean>;
    generateUrl(publicId: string, transformations?: Record<string, any>): string;
    healthCheck(): Promise<StorageHealthStatus>;
    getUsage(): Promise<StorageUsageInfo>;
}
