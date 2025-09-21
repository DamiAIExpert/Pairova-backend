// src/admin/job-seekers/admin-job-seekers.controller.ts
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
import { AdminJobSeekersService } from './admin-job-seekers.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminJobSeekerDto, AdminJobSeekerListDto } from './dto/admin-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

/**
 * @class AdminJobSeekersController
 * @description Provides admin endpoints for managing job seekers (applicants).
 */
@ApiTags('Admin - Job Seekers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/job-seekers')
export class AdminJobSeekersController {
  constructor(private readonly adminJobSeekersService: AdminJobSeekersService) {}

  /**
   * @route GET /admin/job-seekers
   * @description Get paginated list of all job seekers with filtering options.
   */
  @Get()
  @ApiOperation({ summary: 'Get paginated list of all job seekers' })
  @ApiResponse({ status: 200, description: 'List of job seekers retrieved successfully.', type: AdminJobSeekerListDto })
  findAll(@Query() paginationDto: PaginationDto, @Query('search') search?: string) {
    return this.adminJobSeekersService.findAll(paginationDto, { search });
  }

  /**
   * @route GET /admin/job-seekers/:id
   * @description Get detailed information about a specific job seeker.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get job seeker details by ID' })
  @ApiResponse({ status: 200, description: 'Job seeker details retrieved successfully.', type: AdminJobSeekerDto })
  @ApiResponse({ status: 404, description: 'Job seeker not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminJobSeekersService.findOne(id);
  }

  /**
   * @route PUT /admin/job-seekers/:id
   * @description Update job seeker profile information.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update job seeker profile' })
  @ApiResponse({ status: 200, description: 'Job seeker updated successfully.', type: AdminJobSeekerDto })
  @ApiResponse({ status: 404, description: 'Job seeker not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateJobSeekerDto: UpdateJobSeekerDto) {
    return this.adminJobSeekersService.update(id, updateJobSeekerDto);
  }

  /**
   * @route DELETE /admin/job-seekers/:id
   * @description Delete or suspend a job seeker account.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete or suspend job seeker account' })
  @ApiResponse({ status: 200, description: 'Job seeker deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Job seeker not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminJobSeekersService.remove(id);
  }

  /**
   * @route GET /admin/job-seekers/:id/applied
   * @description Get all applied jobs for a specific job seeker.
   */
  @Get(':id/applied')
  @ApiOperation({ summary: 'Get job seeker applied jobs' })
  @ApiResponse({ status: 200, description: 'Applied jobs retrieved successfully.' })
  getAppliedJobs(@Param('id', ParseUUIDPipe) id: string, @Query() paginationDto: PaginationDto) {
    return this.adminJobSeekersService.getAppliedJobs(id, paginationDto);
  }

  /**
   * @route GET /admin/job-seekers/:id/education
   * @description Get education records for a job seeker.
   */
  @Get(':id/education')
  @ApiOperation({ summary: 'Get job seeker education records' })
  @ApiResponse({ status: 200, description: 'Education records retrieved successfully.' })
  getEducation(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminJobSeekersService.getEducation(id);
  }

  /**
   * @route GET /admin/job-seekers/:id/experience
   * @description Get experience records for a job seeker.
   */
  @Get(':id/experience')
  @ApiOperation({ summary: 'Get job seeker experience records' })
  @ApiResponse({ status: 200, description: 'Experience records retrieved successfully.' })
  getExperience(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminJobSeekersService.getExperience(id);
  }

  /**
   * @route GET /admin/job-seekers/:id/certifications
   * @description Get certification records for a job seeker.
   */
  @Get(':id/certifications')
  @ApiOperation({ summary: 'Get job seeker certification records' })
  @ApiResponse({ status: 200, description: 'Certification records retrieved successfully.' })
  getCertifications(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminJobSeekersService.getCertifications(id);
  }
}
