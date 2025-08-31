import { AuditAction } from '../../../common/enums/audit-action.enum';
export declare class AuditLog {
    id: string;
    timestamp: Date;
    adminId: string;
    action: AuditAction;
    resourceType: string;
    resourceId: string;
    reason: string;
    beforeData: Record<string, any>;
    afterData: Record<string, any>;
    ipAddress: string;
}
