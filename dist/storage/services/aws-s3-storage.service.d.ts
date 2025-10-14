import { StorageProviderInterface, UploadOptions, UploadResult, StorageHealthStatus, StorageUsageInfo } from '../interfaces/storage-provider.interface';
import { AwsS3ConfigDto } from '../dto/storage-provider.dto';
export declare class AwsS3StorageService implements StorageProviderInterface {
    private s3Client;
    private config;
    constructor();
    initialize(config: AwsS3ConfigDto): void;
    upload(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult>;
    delete(publicId: string): Promise<boolean>;
    generateUrl(publicId: string, transformations?: Record<string, any>): string;
    healthCheck(): Promise<StorageHealthStatus>;
    getUsage(): Promise<StorageUsageInfo>;
}
