// src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/strategies/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AdminService } from './admin.service';

/**
 * @class AdminController
 * @description Provides general administrative endpoints. Access is restricted to administrators.
 */
@ApiTags('Admin - General')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * @route GET /admin/dashboard-stats
   * @description Retrieves key statistics for the admin dashboard.
   * @returns {Promise<any>} An object containing dashboard metrics.
   */
  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get statistics for the admin dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully.' })
  getDashboardStats(): Promise<any> {
    return this.adminService.getDashboardStats();
  }
}
