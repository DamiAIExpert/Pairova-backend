import { User } from '../../../users/shared/user.entity';
export declare class Certification {
    id: string;
    userId: string;
    applicantId: string;
    user: User;
    name: string;
    issuer: string;
    issueDate: Date;
    issuedDate: Date;
    credentialUrl: string;
    credentialId: string;
    createdAt: Date;
}
