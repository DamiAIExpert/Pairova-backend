import { StorageType } from '../../common/enums/storage-type.enum';
import { FileUpload } from './file-upload.entity';
export declare class StorageProvider {
    id: string;
    name: string;
    type: StorageType;
    isActive: boolean;
    priority: number;
    configuration: Record<string, any>;
    description: string;
    usageCount: number;
    totalStorageUsed: number;
    isHealthy: boolean;
    lastHealthCheck: Date;
    healthCheckError: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    files: FileUpload[];
}
