import { EmploymentType } from '../../../common/enums/employment-type.enum';
export declare class CreateExperienceDto {
    company: string;
    roleTitle: string;
    employmentType?: EmploymentType;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    postalCode?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}
