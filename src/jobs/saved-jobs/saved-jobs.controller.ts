import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';

@ApiTags('Saved Jobs')
@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get saved jobs for current user' })
  @ApiResponse({ status: 200, description: 'Saved jobs retrieved successfully.' })
  async getSavedJobs(
    @CurrentUser() user: User,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return this.savedJobsService.getSavedJobs(user.id, page, limit);
  }

  @Post(':jobId')
  @ApiOperation({ summary: 'Save a job' })
  @ApiResponse({ status: 201, description: 'Job saved successfully.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  @ApiResponse({ status: 409, description: 'Job already saved.' })
  async saveJob(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ) {
    return this.savedJobsService.saveJob(user.id, jobId);
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Unsave a job' })
  @ApiResponse({ status: 200, description: 'Job unsaved successfully.' })
  @ApiResponse({ status: 404, description: 'Saved job not found.' })
  async unsaveJob(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ) {
    await this.savedJobsService.unsaveJob(user.id, jobId);
    return { message: 'Job unsaved successfully' };
  }

  @Get(':jobId/status')
  @ApiOperation({ summary: 'Check if job is saved' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully.' })
  async isJobSaved(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ) {
    const isSaved = await this.savedJobsService.isJobSaved(user.id, jobId);
    return { isSaved };
  }
}
