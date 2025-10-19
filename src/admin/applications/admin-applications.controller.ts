// src/admin/applications/admin-applications.controller.ts
import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminApplicationsService } from './admin-applications.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  AdminApplicationDto, 
  AdminApplicationListDto, 
  UpdateApplicationStatusDto,
  ApplicationPipelineDto 
} from './dto/admin-application.dto';

/**
 * @class AdminApplicationsController
 * @description Provides admin endpoints for managing job applications and pipeline.
 */
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/applications')
export class AdminApplicationsController {
  constructor(private readonly adminApplicationsService: AdminApplicationsService) {}

  /**
   * @route GET /admin/applications
   * @description Get paginated list of all applications with filtering options.
   */
  @Get()
  @ApiOperation({ summary: 'Get paginated list of all applications' })
  @ApiResponse({ status: 200, description: 'List of applications retrieved successfully.', type: AdminApplicationListDto })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
    @Query('jobId') jobId?: string,
    @Query('applicantId') applicantId?: string,
    @Query('ngoId') ngoId?: string,
    @Query('search') search?: string,
  ) {
    return this.adminApplicationsService.findAll(paginationDto, { status, jobId, applicantId, ngoId, search });
  }

  /**
   * @route GET /admin/applications/:id
   * @description Get detailed information about a specific application.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get application details by ID' })
  @ApiResponse({ status: 200, description: 'Application details retrieved successfully.', type: AdminApplicationDto })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminApplicationsService.findOne(id);
  }

  /**
   * @route PUT /admin/applications/:id/status
   * @description Update application status (move through pipeline).
   */
  @Put(':id/status')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({ status: 200, description: 'Application status updated successfully.', type: AdminApplicationDto })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.adminApplicationsService.updateStatus(id, updateApplicationStatusDto);
  }

  /**
   * @route GET /admin/applications/pipeline
   * @description Get application pipeline overview with counts by status.
   */
  @Get('pipeline')
  @ApiOperation({ summary: 'Get application pipeline overview' })
  @ApiResponse({ status: 200, description: 'Pipeline overview retrieved successfully.', type: ApplicationPipelineDto })
  getPipeline(@Query('ngoId') ngoId?: string) {
    return this.adminApplicationsService.getPipeline(ngoId);
  }

  /**
   * @route GET /admin/applications/statistics
   * @description Get application statistics and metrics.
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get application statistics' })
  @ApiResponse({ status: 200, description: 'Application statistics retrieved successfully.' })
  getStatistics(@Query('ngoId') ngoId?: string) {
    return this.adminApplicationsService.getStatistics(ngoId);
  }
}
