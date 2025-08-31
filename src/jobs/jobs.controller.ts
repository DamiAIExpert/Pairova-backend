// src/jobs/jobs.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/strategies/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateJobDto } from './dto/create-job.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/shared/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NONPROFIT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting (Non-Profit only)' })
  @ApiResponse({ status: 201, description: 'The job has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: User) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get a list of all published jobs' })
  findAll() {
    return this.jobsService.findAllPublished();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single job' })
  @ApiResponse({ status: 200, description: 'Returns the job details.'})
  @ApiResponse({ status: 404, description: 'Job not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }
}
