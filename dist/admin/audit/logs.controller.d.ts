import { LogsService } from './logs.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuditLog } from './entities/audit-log.entity';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    list(paginationDto: PaginationDto): Promise<{
        data: AuditLog[];
        total: number;
    }>;
}
