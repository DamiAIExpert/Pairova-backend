import { Repository } from 'typeorm';
import { NonprofitOrg } from './nonprofit.entity';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { User } from '../shared/user.entity';
export declare class NonprofitService {
    private readonly nonprofitRepository;
    private readonly logger;
    constructor(nonprofitRepository: Repository<NonprofitOrg>);
    createProfile(userId: string, orgName: string): Promise<NonprofitOrg>;
    getProfile(user: User): Promise<NonprofitOrg>;
    updateProfile(user: User, updateDto: UpdateNonprofitProfileDto): Promise<NonprofitOrg>;
    completeOnboarding(user: User, onboardingDto: CompleteOnboardingDto): Promise<NonprofitOrg>;
}
