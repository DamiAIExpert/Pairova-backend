import { Repository } from 'typeorm';
import { ApplicantProfile } from './applicant.entity';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { User } from '../shared/user.entity';
export declare class ApplicantService {
    private readonly applicantProfileRepository;
    constructor(applicantProfileRepository: Repository<ApplicantProfile>);
    getProfile(user: User): Promise<ApplicantProfile>;
    updateProfile(user: User, updateDto: UpdateApplicantProfileDto): Promise<ApplicantProfile>;
}
