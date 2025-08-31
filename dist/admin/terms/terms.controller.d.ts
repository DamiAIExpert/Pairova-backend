import { TermsService } from './terms.service';
import { PolicyType } from '../../common/enums/policy-type.enum';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { User } from '../../users/shared/user.entity';
export declare class TermsController {
    private readonly termsService;
    constructor(termsService: TermsService);
    current(type: PolicyType): Promise<import("./entities/policy.entity").Policy>;
    update(type: PolicyType, dto: UpdatePolicyDto, admin: User): Promise<import("./entities/policy.entity").Policy>;
}
