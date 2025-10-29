import { User } from '../../users/shared/user.entity';
import { ConfigService } from '@nestjs/config';
export declare class SimpleUploadController {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, user: User): Promise<{
        success: boolean;
        url: any;
        publicId: any;
        format: any;
        size: any;
        width: any;
        height: any;
    }>;
}
