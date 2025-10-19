// src/admin/audit/logs.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuditLog } from './entities/audit-log.entity';

/**
 * @class LogsController
 * @description Provides endpoints for viewing audit logs. Access is restricted to administrators.
 */
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/audit')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * @route GET /admin/audit/logs
   * @description Retrieves a paginated list of all audit log entries.
   * @param {PaginationDto} paginationDto - Query parameters for pagination.
   * @returns {Promise<{ data: AuditLog[]; total: number }>} A paginated list of logs.
   */
  @Get('logs')
  @ApiOperation({ summary: 'List all audit log entries (paginated)' })
  @ApiResponse({ status: 200, description: 'A paginated list of audit logs.' })
  list(@Query() paginationDto: PaginationDto): Promise<{ data: AuditLog[]; total: number }> {
    return this.logsService.findAll(paginationDto);
  }
}
