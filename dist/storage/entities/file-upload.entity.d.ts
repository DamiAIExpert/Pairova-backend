import { StorageProvider } from './storage-provider.entity';
import { User } from '../../users/shared/user.entity';
import { FileType } from '../../common/enums/file-type.enum';
export declare class FileUpload {
    id: string;
    filename: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl: string;
    fileType: FileType;
    folder: string;
    metadata: Record<string, any>;
    publicId: string;
    isPublic: boolean;
    userId: string;
    user: User;
    storageProviderId: string;
    storageProvider: StorageProvider;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
