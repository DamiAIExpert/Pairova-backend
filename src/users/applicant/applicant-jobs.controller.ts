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
  Body,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../shared/user.entity';
import { JobsService } from '../../jobs/jobs.service';
import { JobSearchService } from '../../jobs/job-search/job-search.service';
import { ApplicationsService } from '../../jobs/job-application/application.service';
import { CreateApplicationDto } from '../../jobs/dto/create-application.dto';
import { NotificationService } from '../../notifications/notification.service';
import { ApplicationStatus } from '../../common/enums/job.enum';

/**
 * @class ApplicantJobsController
 * @description Controller for job seeker-specific job search and application functionality
 */
@ApiTags('Job Seeker - Job Search & Applications')
@Controller('applicants/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.APPLICANT)
@ApiBearerAuth()
export class ApplicantJobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobSearchService: JobSearchService,
    private readonly applicationsService: ApplicationsService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Search for jobs with filters
   */
  @Get('jobs/search')
  @ApiOperation({ summary: 'Search for jobs with filters' })
  @ApiResponse({
    status: 200,
    description: 'Job search results retrieved successfully',
  })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Search query' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Location filter' })
  @ApiQuery({ name: 'employmentType', required: false, type: String, description: 'Employment type filter' })
  @ApiQuery({ name: 'experienceLevel', required: false, type: String, description: 'Experience level filter' })
  @ApiQuery({ name: 'salaryMin', required: false, type: Number, description: 'Minimum salary filter' })
  @ApiQuery({ name: 'salaryMax', required: false, type: Number, description: 'Maximum salary filter' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async searchJobs(
    @CurrentUser() user: User,
    @Query() searchParams: any,
  ): Promise<{ jobs: any[]; total: number; page: number; limit: number; filters: any }> {
    return this.jobSearchService.searchJobsForApplicant(user, searchParams);
  }

  /**
   * Get recommended jobs for the current applicant
   */
  @Get('jobs/recommended')
  @ApiOperation({ summary: 'Get personalized job recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Recommended jobs retrieved successfully',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations' })
  async getRecommendedJobs(
    @CurrentUser() user: User,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<{ jobs: any[]; total: number }> {
    return this.jobSearchService.getRecommendedJobsForApplicant(user, limit);
  }

  /**
   * Get saved jobs
   */
  @Get('jobs/saved')
  @ApiOperation({ summary: 'Get saved jobs' })
  @ApiResponse({
    status: 200,
    description: 'Saved jobs retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getSavedJobs(
    @CurrentUser() user: User,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ): Promise<{ jobs: any[]; total: number; page: number; limit: number }> {
    return this.jobSearchService.getSavedJobsForApplicant(user, page, limit);
  }

  /**
   * Save a job
   */
  @Post('jobs/:jobId/save')
  @ApiOperation({ summary: 'Save a job' })
  @ApiResponse({
    status: 201,
    description: 'Job saved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 409, description: 'Job already saved' })
  async saveJob(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ): Promise<{ message: string }> {
    await this.jobSearchService.saveJobForApplicant(user, jobId);
    return { message: 'Job saved successfully' };
  }

  /**
   * Unsave a job
   */
  @Delete('jobs/:jobId/save')
  @ApiOperation({ summary: 'Unsave a job' })
  @ApiResponse({
    status: 200,
    description: 'Job unsaved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found or not saved' })
  async unsaveJob(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ): Promise<{ message: string }> {
    await this.jobSearchService.unsaveJobForApplicant(user, jobId);
    return { message: 'Job unsaved successfully' };
  }

  /**
   * Apply for a job
   */
  @Post('jobs/:jobId/apply')
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 409, description: 'Already applied for this job' })
  async applyForJob(
    @CurrentUser() user: User,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body(ValidationPipe) applicationData: CreateApplicationDto,
  ): Promise<{ message: string; applicationId: string }> {
    const application = await this.applicationsService.apply(
      { ...applicationData, jobId },
      user,
    );
    return { message: 'Application submitted successfully', applicationId: application.id };
  }

  /**
   * Get my applications
   */
  @Get('applications')
  @ApiOperation({ summary: 'Get my job applications' })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by application status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getMyApplications(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ): Promise<{ applications: any[]; total: number; page: number; limit: number }> {
    const applications = await this.applicationsService.findAllForUser(user);
    const filteredApplications = status 
      ? applications.filter(app => app.status === status)
      : applications;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
    
    return {
      applications: paginatedApplications,
      total: filteredApplications.length,
      page,
      limit,
    };
  }

  /**
   * Get specific application details
   */
  @Get('applications/:id')
  @ApiOperation({ summary: 'Get specific application details' })
  @ApiResponse({
    status: 200,
    description: 'Application retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized - Application belongs to another user' })
  async getApplication(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.applicationsService.findOne(id, user);
  }

  /**
   * Withdraw an application
   */
  @Delete('applications/:id')
  @ApiOperation({ summary: 'Withdraw an application' })
  @ApiResponse({
    status: 200,
    description: 'Application withdrawn successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized - Application belongs to another user' })
  @ApiResponse({ status: 400, description: 'Cannot withdraw application - Status not allowed' })
  async withdrawApplication(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    const application = await this.applicationsService.findOne(id, user);
    
    // Check if application can be withdrawn (e.g., not already accepted)
    if (application.status === ApplicationStatus.ACCEPTED) {
      throw new ForbiddenException('Cannot withdraw an accepted application');
    }
    
    // For now, we'll just delete the application
    // In a real system, you might want to mark it as withdrawn instead
    await this.applicationsService.remove(id);
    return { message: 'Application withdrawn successfully' };
  }

  /**
   * Get job seeker dashboard
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get job seeker dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  async getDashboard(@CurrentUser() user: User): Promise<{
    recentApplications: any[];
    savedJobs: any[];
    recommendedJobs: any[];
    statistics: {
      totalApplications: number;
      pendingApplications: number;
      acceptedApplications: number;
      rejectedApplications: number;
      savedJobsCount: number;
    };
    notifications: any[];
  }> {
    const [applications, savedJobs, recommendedJobs, notifications] = await Promise.all([
      this.applicationsService.findAllForUser(user),
      this.jobSearchService.getSavedJobsForApplicant(user, 1, 5),
      this.jobSearchService.getRecommendedJobsForApplicant(user, 5),
      this.notificationService.getUserNotifications(user.id, 1, 10),
    ]);

    const statistics = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === ApplicationStatus.PENDING).length,
      acceptedApplications: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
      rejectedApplications: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
      savedJobsCount: savedJobs.total,
    };

    return {
      recentApplications: applications.slice(0, 5),
      savedJobs: savedJobs.jobs,
      recommendedJobs: recommendedJobs.jobs,
      statistics,
      notifications: notifications.notifications,
    };
  }

  /**
   * Get application statistics
   */
  @Get('applications/statistics')
  @ApiOperation({ summary: 'Get application statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getApplicationStatistics(@CurrentUser() user: User): Promise<{
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    applicationsThisMonth: number;
    averageResponseTime: number;
    successRate: number;
  }> {
    const applications = await this.applicationsService.findAllForUser(user);
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const applicationsThisMonth = applications.filter(app => 
      new Date(app.createdAt) >= thisMonth
    ).length;

    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === ApplicationStatus.PENDING).length;
    const acceptedApplications = applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length;
    const rejectedApplications = applications.filter(app => app.status === ApplicationStatus.REJECTED).length;
    
    const successRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0;
    
    // Calculate average response time (simplified)
    const averageResponseTime = 0; // TODO: Implement proper response time calculation

    return {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      applicationsThisMonth,
      averageResponseTime,
      successRate,
    };
  }
}