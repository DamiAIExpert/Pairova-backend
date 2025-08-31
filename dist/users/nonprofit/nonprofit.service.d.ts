import { Repository } from 'typeorm';
import { NonprofitOrg } from './nonprofit.entity';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { User } from '../shared/user.entity';
export declare class NonprofitService {
    private readonly nonprofitRepository;
    constructor(nonprofitRepository: Repository<NonprofitOrg>);
    getProfile(user: User): Promise<NonprofitOrg>;
    updateProfile(user: User, updateDto: UpdateNonprofitProfileDto): Promise<NonprofitOrg>;
}
