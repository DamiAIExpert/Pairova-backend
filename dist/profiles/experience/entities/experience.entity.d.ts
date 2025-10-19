import { User } from '../../../users/shared/user.entity';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
export declare class Experience {
    id: string;
    userId: string;
    applicantId: string;
    user: User;
    company: string;
    roleTitle: string;
    employmentType: EmploymentType;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    startDate: Date;
    endDate: Date;
    description: string;
    createdAt: Date;
}
