import { ConfigService } from '@nestjs/config';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
export declare const configureCloudinary: (configService: ConfigService) => void;
export declare const getMulterMemoryStorage: () => {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
};
export declare const uploadToCloudinary: (file: Express.Multer.File, options?: UploadApiOptions) => Promise<{
    url: string;
    publicId: string;
    raw: UploadApiResponse;
}>;
