import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../../users/shared/user.entity';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class LogsService {
    private readonly auditLogRepository;
    private readonly logger;
    constructor(auditLogRepository: Repository<AuditLog>);
    logAction(admin: User, action: AuditAction, resourceType: string, resourceId?: string, changes?: {
        before?: any;
        after?: any;
    }): Promise<void>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: AuditLog[];
        total: number;
    }>;
}
