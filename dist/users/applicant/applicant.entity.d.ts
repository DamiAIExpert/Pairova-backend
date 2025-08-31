import { User } from '../shared/user.entity';
import { Gender } from '../../common/enums/gender.enum';
export declare class ApplicantProfile {
    userId: string;
    user: User;
    firstName: string;
    lastName: string;
    gender: Gender;
    dob: Date;
    bio: string;
    country: string;
    state: string;
    city: string;
    photoUrl: string;
    portfolioUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
