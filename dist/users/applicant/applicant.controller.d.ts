import { ApplicantService } from './applicant.service';
import { User } from '../shared/user.entity';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { ApplicantProfile } from './applicant.entity';
export declare class ApplicantController {
    private readonly applicantService;
    constructor(applicantService: ApplicantService);
    me(user: User): Promise<ApplicantProfile>;
    update(user: User, updateDto: UpdateApplicantProfileDto): Promise<ApplicantProfile>;
}
