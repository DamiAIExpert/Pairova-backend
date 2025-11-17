import { User } from '../../../users/shared/user.entity';
export declare class Education {
    id: string;
    userId: string;
    applicantId: string;
    user: User;
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    grade?: string;
    role?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
}
