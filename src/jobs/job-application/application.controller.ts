// src/jobs/job-application/application.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService } from './application.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { CreateComprehensiveApplicationDto } from '../dto/create-comprehensive-application.dto';
import { UpdateApplicationStatusDto } from '../dto/update-application-status.dto';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.APPLICANT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Submit a new job application (Applicant only)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  apply(@Body() createApplicationDto: CreateApplicationDto, @CurrentUser() user: User) {
    return this.applicationsService.apply(createApplicationDto, user);
  }

  @Post('comprehensive')
  @Roles(Role.APPLICANT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Submit a comprehensive job application with detailed data (Applicant only)' })
  @ApiResponse({ status: 201, description: 'Comprehensive application submitted successfully.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Already applied for this job.' })
  applyComprehensive(
    @Body() createComprehensiveDto: CreateComprehensiveApplicationDto, 
    @CurrentUser() user: User
  ) {
    return this.applicationsService.applyComprehensive(createComprehensiveDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications for the current user' })
  findAllForCurrentUser(@CurrentUser() user: User) {
    return this.applicationsService.findAllForUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by ID' })
  @ApiResponse({ status: 200, description: 'Returns the application details.'})
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.applicationsService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(Role.NONPROFIT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update application status (Nonprofit only)' })
  @ApiResponse({ status: 200, description: 'Application status updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only job owner can update status.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.applicationsService.updateStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.notes,
      user,
    );
  }
}
