import { PolicyType } from '../../../common/enums/policy-type.enum';
export declare class Policy {
    id: string;
    type: PolicyType;
    version: string;
    content: Record<string, any>;
    effectiveAt: Date;
    publishedBy: string;
    createdAt: Date;
}
