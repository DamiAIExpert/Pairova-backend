// src/jobs/job-application/application.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
}
