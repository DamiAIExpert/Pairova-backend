import { User } from '../../../users/shared/user.entity';
export declare class Upload {
    id: string;
    userId: string | null;
    user: User | null;
    kind: string;
    fileUrl: string;
    publicId: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    filename: string | null;
    url: string | null;
    size: number | null;
    createdAt: Date;
}
