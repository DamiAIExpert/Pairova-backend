import { Repository } from 'typeorm';
import { ApplicantProfile } from './applicant.entity';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { UpdatePrivacySettingsDto } from './dto/update-privacy-settings.dto';
import { PrivacySettingsResponseDto } from './dto/privacy-settings-response.dto';
import { User } from '../shared/user.entity';
export declare class ApplicantService {
    private readonly applicantProfileRepository;
    private readonly logger;
    constructor(applicantProfileRepository: Repository<ApplicantProfile>);
    createProfile(userId: string): Promise<ApplicantProfile>;
    getProfile(user: User): Promise<ApplicantProfile>;
    updateProfile(user: User, updateDto: UpdateApplicantProfileDto): Promise<ApplicantProfile>;
    getPrivacySettings(user: User): Promise<PrivacySettingsResponseDto>;
    updatePrivacySettings(user: User, updateDto: UpdatePrivacySettingsDto): Promise<PrivacySettingsResponseDto>;
    allowsAiTraining(userId: string): Promise<boolean>;
    allowsProfileIndexing(userId: string): Promise<boolean>;
    allowsDataAnalytics(userId: string): Promise<boolean>;
}
