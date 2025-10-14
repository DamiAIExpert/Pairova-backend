import { StorageType } from '../../common/enums/storage-type.enum';
import { StorageProviderInterface } from '../interfaces/storage-provider.interface';
export declare class StorageProviderFactoryService {
    private providers;
    createProvider(type: StorageType, configuration: any): StorageProviderInterface;
    getProvider(type: StorageType, configuration: any): StorageProviderInterface;
    clearCache(): void;
    validateConfiguration(type: StorageType, configuration: any): boolean;
    private validateCloudinaryConfig;
    private validateAwsS3Config;
    private validateGoogleCloudConfig;
    private validateAzureBlobConfig;
    private validateLocalConfig;
    getSupportedTypes(): StorageType[];
    getTypeDescription(type: StorageType): string;
}
