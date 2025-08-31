import { Role } from '../../common/enums/role.enum';
import { ApplicantProfile } from '../applicant/applicant.entity';
import { NonprofitOrg } from '../nonprofit/nonprofit.entity';
export declare class User {
    id: string;
    role: Role;
    email: string;
    passwordHash: string;
    phone: string;
    isVerified: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    applicantProfile: ApplicantProfile;
    nonprofitOrg: NonprofitOrg;
}
