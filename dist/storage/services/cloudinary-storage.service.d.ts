import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { CloudinaryConfigDto } from '../dto/storage-provider.dto';
export declare class CloudinaryStorageService implements StorageProviderInterface {
    private config;
    constructor();
    initialize(config: CloudinaryConfigDto): void;
    upload(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult>;
    delete(publicId: string): Promise<boolean>;
    generateUrl(publicId: string, transformations?: Record<string, any>): string;
    generateThumbnailUrl(publicId: string): string;
    healthCheck(): Promise<StorageHealthStatus>;
    getUsage(): Promise<StorageUsageInfo>;
}
