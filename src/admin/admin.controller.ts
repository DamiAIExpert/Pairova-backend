// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/strategies/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AdminService } from './admin.service';
import { DashboardStatsDto, PerformanceMetricsDto, ActivityFeedDto } from './dto/dashboard.dto';

/**
 * @class AdminController
 * @description Provides general administrative endpoints. Access is restricted to administrators.
 */
@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * @route GET /admin/dashboard-stats
   * @description Retrieves key statistics for the admin dashboard.
   * @returns {Promise<DashboardStatsDto>} An object containing dashboard metrics.
   */
  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get statistics for the admin dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully.', type: DashboardStatsDto })
  getDashboardStats(): Promise<DashboardStatsDto> {
    return this.adminService.getDashboardStats();
  }

  /**
   * @route GET /admin/dashboard/performance
   * @description Get performance metrics over time for charts and analytics.
   */
  @Get('dashboard/performance')
  @ApiOperation({ summary: 'Get performance metrics over time' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully.', type: PerformanceMetricsDto })
  getPerformanceMetrics(@Query('period') period?: string): Promise<PerformanceMetricsDto> {
    return this.adminService.getPerformanceMetrics(period || '30d');
  }

  /**
   * @route GET /admin/dashboard/activity
   * @description Get recent activity feed for the dashboard.
   */
  @Get('dashboard/activity')
  @ApiOperation({ summary: 'Get recent activity feed' })
  @ApiResponse({ status: 200, description: 'Activity feed retrieved successfully.', type: ActivityFeedDto })
  getActivityFeed(@Query('limit') limit?: number): Promise<ActivityFeedDto> {
    return this.adminService.getActivityFeed(limit || 10);
  }

  /**
   * @route GET /admin/dashboard/recommendations
   * @description Get AI matching insights and recommendations.
   */
  @Get('dashboard/recommendations')
  @ApiOperation({ summary: 'Get AI matching insights' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully.' })
  getRecommendations() {
    return this.adminService.getRecommendations();
  }
}
