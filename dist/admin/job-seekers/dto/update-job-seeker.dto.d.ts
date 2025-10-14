import { Gender } from '../../../common/enums/gender.enum';
export declare class UpdateJobSeekerDto {
    isVerified?: boolean;
    phone?: string;
    firstName?: string;
    lastName?: string;
    gender?: Gender;
    dob?: string;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    portfolioUrl?: string;
}
