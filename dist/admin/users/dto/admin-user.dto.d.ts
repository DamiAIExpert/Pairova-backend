import { Role } from '../../../common/enums/role.enum';
export declare class AdminUserDto {
    id: string;
    email: string;
    role: Role;
    isVerified: boolean;
    phone?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    firstName?: string;
    lastName?: string;
    orgName?: string;
    photoUrl?: string;
    logoUrl?: string;
    city?: string;
    country?: string;
    applicationCount?: number;
    jobCount?: number;
}
export declare class AdminUserListDto {
    data: AdminUserDto[];
    total: number;
    page: number;
    limit: number;
}
export declare class UpdateUserStatusDto {
    isVerified?: boolean;
    role?: Role;
    phone?: string;
}
