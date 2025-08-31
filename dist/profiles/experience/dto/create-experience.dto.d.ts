import { EmploymentType } from '../../../common/enums/employment-type.enum';
export declare class CreateExperienceDto {
    company: string;
    roleTitle: string;
    employmentType?: EmploymentType;
    locationCity?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}
