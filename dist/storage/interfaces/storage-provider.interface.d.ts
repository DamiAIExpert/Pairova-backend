export interface UploadOptions {
    folder?: string;
    isPublic?: boolean;
    metadata?: Record<string, any>;
    transformations?: Record<string, any>;
}
export interface UploadResult {
    url: string;
    thumbnailUrl?: string;
    publicId?: string;
    size: number;
    metadata?: Record<string, any>;
}
export interface StorageProviderInterface {
    upload(file: Express.Multer.File, options?: UploadOptions): Promise<UploadResult>;
    delete(publicId: string): Promise<boolean>;
    generateUrl(publicId: string, transformations?: Record<string, any>): string;
    healthCheck(): Promise<StorageHealthStatus>;
    getUsage(): Promise<StorageUsageInfo>;
}
export interface StorageHealthStatus {
    isHealthy: boolean;
    responseTime: number;
    error?: string;
    status: Record<string, any>;
}
export interface StorageUsageInfo {
    totalStorage: number;
    fileCount: number;
    bandwidthUsed: number;
    quota?: number;
    remaining?: number;
}
