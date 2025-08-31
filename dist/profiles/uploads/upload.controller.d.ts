import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';
export declare class UploadController {
    private readonly uploadService;
    private readonly configService;
    constructor(uploadService: UploadService, configService: ConfigService);
    uploadFile(file: Express.Multer.File, user: User, kind?: string): Promise<UploadDto>;
}
