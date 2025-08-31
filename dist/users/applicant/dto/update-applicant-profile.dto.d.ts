import { Gender } from '../../../common/enums/gender.enum';
export declare class UpdateApplicantProfileDto {
    firstName?: string;
    lastName?: string;
    gender?: Gender;
    dob?: Date;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    photoUrl?: string;
    portfolioUrl?: string;
}
