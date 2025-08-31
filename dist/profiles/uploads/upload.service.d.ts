import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';
export declare class UploadService {
    private readonly uploadsRepo;
    constructor(uploadsRepo: Repository<Upload>);
    processAndRecordUpload(file: Express.Multer.File, user: User, kind?: string): Promise<UploadDto>;
    listUserUploads(userId: string, kind?: string): Promise<UploadDto[]>;
}
