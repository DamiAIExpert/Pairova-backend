import { User } from '../../../users/shared/user.entity';
export declare class Certification {
    id: string;
    userId: string;
    user: User;
    name: string;
    issuer: string;
    issueDate: Date;
    credentialUrl: string;
    createdAt: Date;
}
