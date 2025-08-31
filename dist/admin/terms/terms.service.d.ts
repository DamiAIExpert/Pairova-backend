import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { PolicyType } from '../../common/enums/policy-type.enum';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { User } from '../../users/shared/user.entity';
export declare class TermsService {
    private readonly policyRepository;
    constructor(policyRepository: Repository<Policy>);
    getPolicy(type: PolicyType): Promise<Policy>;
    updatePolicy(type: PolicyType, dto: UpdatePolicyDto, admin: User): Promise<Policy>;
}
