import { NonprofitService } from './nonprofit.service';
import { User } from '../shared/user.entity';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { NonprofitOrg } from './nonprofit.entity';
export declare class NonprofitController {
    private readonly nonprofitService;
    constructor(nonprofitService: NonprofitService);
    me(user: User): Promise<NonprofitOrg>;
    update(user: User, updateDto: UpdateNonprofitProfileDto): Promise<NonprofitOrg>;
    completeOnboarding(user: User, onboardingDto: CompleteOnboardingDto): Promise<NonprofitOrg>;
}
