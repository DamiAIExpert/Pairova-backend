// src/admin/ngos/admin-ngos.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminNgosService } from './admin-ngos.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminNgoDto, AdminNgoListDto } from './dto/admin-ngo.dto';
import { UpdateNgoDto } from './dto/update-ngo.dto';

/**
 * @class AdminNgosController
 * @description Provides admin endpoints for managing NGOs (non-profit organizations).
 */
@ApiTags('Admin - NGOs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/ngos')
export class AdminNgosController {
  constructor(private readonly adminNgosService: AdminNgosService) {}

  /**
   * @route GET /admin/ngos
   * @description Get paginated list of all NGOs with filtering options.
   */
  @Get()
  @ApiOperation({ summary: 'Get paginated list of all NGOs' })
  @ApiResponse({ status: 200, description: 'List of NGOs retrieved successfully.', type: AdminNgoListDto })
  findAll(@Query() paginationDto: PaginationDto, @Query('search') search?: string) {
    return this.adminNgosService.findAll(paginationDto, { search });
  }

  /**
   * @route GET /admin/ngos/:id
   * @description Get detailed information about a specific NGO.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get NGO details by ID' })
  @ApiResponse({ status: 200, description: 'NGO details retrieved successfully.', type: AdminNgoDto })
  @ApiResponse({ status: 404, description: 'NGO not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminNgosService.findOne(id);
  }

  /**
   * @route PUT /admin/ngos/:id
   * @description Update NGO profile information.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update NGO profile' })
  @ApiResponse({ status: 200, description: 'NGO updated successfully.', type: AdminNgoDto })
  @ApiResponse({ status: 404, description: 'NGO not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateNgoDto: UpdateNgoDto) {
    return this.adminNgosService.update(id, updateNgoDto);
  }

  /**
   * @route DELETE /admin/ngos/:id
   * @description Delete or suspend an NGO account.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete or suspend NGO account' })
  @ApiResponse({ status: 200, description: 'NGO deleted successfully.' })
  @ApiResponse({ status: 404, description: 'NGO not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminNgosService.remove(id);
  }

  /**
   * @route GET /admin/ngos/:id/jobs
   * @description Get all jobs posted by a specific NGO.
   */
  @Get(':id/jobs')
  @ApiOperation({ summary: 'Get NGO posted jobs' })
  @ApiResponse({ status: 200, description: 'NGO jobs retrieved successfully.' })
  getJobs(@Param('id', ParseUUIDPipe) id: string, @Query() paginationDto: PaginationDto) {
    return this.adminNgosService.getJobs(id, paginationDto);
  }

  /**
   * @route GET /admin/ngos/:id/jobs/:jobId/applicants
   * @description Get all applicants for a specific job posted by an NGO.
   */
  @Get(':id/jobs/:jobId/applicants')
  @ApiOperation({ summary: 'Get job applicants for NGO job' })
  @ApiResponse({ status: 200, description: 'Job applicants retrieved successfully.' })
  getJobApplicants(
    @Param('id', ParseUUIDPipe) ngoId: string,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.adminNgosService.getJobApplicants(ngoId, jobId, paginationDto);
  }

  /**
   * @route GET /admin/ngos/:id/statistics
   * @description Get statistics for an NGO (jobs posted, applications received, etc.).
   */
  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get NGO statistics' })
  @ApiResponse({ status: 200, description: 'NGO statistics retrieved successfully.' })
  getStatistics(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminNgosService.getStatistics(id);
  }
}
