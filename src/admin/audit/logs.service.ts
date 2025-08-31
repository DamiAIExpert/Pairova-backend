// src/admin/audit/logs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../../users/shared/user.entity';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

/**
 * @class LogsService
 * @description Handles the creation and retrieval of audit log records.
 */
@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Creates a new audit log entry.
   * @param admin - The admin user performing the action.
   * @param action - The type of action performed.
   * @param resourceType - The type of resource being affected (e.g., 'Job', 'User').
   * @param resourceId - The ID of the affected resource.
   * @param changes - An object containing `before` and `after` states of the data.
   * @returns {Promise<void>}
   */
  async logAction(
    admin: User,
    action: AuditAction,
    resourceType: string,
    resourceId?: string,
    changes?: { before?: any; after?: any },
  ): Promise<void> {
    const logEntry = this.auditLogRepository.create({
      adminId: admin.id,
      action,
      resourceType,
      resourceId,
      beforeData: changes?.before,
      afterData: changes?.after,
    });
    await this.auditLogRepository.save(logEntry);
    this.logger.log(`Logged action: ${admin.email} -> ${action} on ${resourceType}`);
  }

  /**
   * Retrieves a paginated list of audit logs.
   * @param paginationDto - DTO containing pagination parameters (page, limit).
   * @returns {Promise<{ data: AuditLog[]; total: number }>} The list of logs and the total count.
   */
  async findAll(paginationDto: PaginationDto): Promise<{ data: AuditLog[]; total: number }> {
    const { page, limit } = paginationDto;
    const [data, total] = await this.auditLogRepository.findAndCount({
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}
