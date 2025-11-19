import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  Body,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../shared/user.entity';
import { ApplicationsService } from '../../jobs/job-application/application.service';
import { ApplicantService } from '../applicant/applicant.service';
import { ExperienceService } from '../../profiles/experience/experience.service';
import { EducationService } from '../../profiles/education/education.service';
import { CertificationService } from '../../profiles/certifications/certification.service';
import { UploadService } from '../../profiles/uploads/upload.service';

/**
 * @class NgoApplicationsController
 * @description Controller for NGO-specific application management functionality
 */
@ApiTags('NGO - Application Management')
@Controller('ngos/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.NONPROFIT)
@ApiBearerAuth('JWT-auth')
export class NgoApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly applicantService: ApplicantService,
    private readonly experienceService: ExperienceService,
    private readonly educationService: EducationService,
    private readonly certificationService: CertificationService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Get all applications to jobs posted by the current NGO
   */
  @Get('applications')
  @ApiOperation({ summary: 'Get all applications to jobs posted by the current NGO' })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by application status' })
  @ApiQuery({ name: 'jobId', required: false, type: String, description: 'Filter by specific job ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getMyApplications(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('jobId') jobId?: string,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
  ): Promise<{ applications: any[]; total: number; page: number; limit: number }> {
    // Parse page and limit with defaults, handling optional parameters
    const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;
    const limit = limitParam ? parseInt(limitParam, 10) || 20 : 20;
    
    return this.applicationsService.getApplicationsByOrganization(
      user,
      { status, jobId },
      page,
      limit,
    );
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
  @ApiResponse({ status: 403, description: 'Unauthorized - Application is for another organization' })
  async getApplication(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.applicationsService.getApplicationByOrganization(id, user);
  }

  /**
   * Update application status
   */
  @Put('applications/:id/status')
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized - Application is for another organization' })
  async updateApplicationStatus(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateData: {
      status: string;
      notes?: string;
      interviewDate?: Date;
      rejectionReason?: string;
    },
  ): Promise<{ message: string }> {
    return this.applicationsService.updateApplicationStatusByOrganization(id, user, updateData);
  }

  /**
   * Get application statistics for the NGO
   */
  @Get('applications/statistics')
  @ApiOperation({ summary: 'Get application statistics for the current NGO' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getApplicationStatistics(@CurrentUser() user: User): Promise<{
    totalApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
    shortlistedApplications: number;
    interviewedApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    applicationsThisMonth: number;
  }> {
    return this.applicationsService.getApplicationStatistics(user);
  }

  /**
   * Get application pipeline overview
   */
  @Get('applications/pipeline')
  @ApiOperation({ summary: 'Get application pipeline overview' })
  @ApiResponse({
    status: 200,
    description: 'Pipeline data retrieved successfully',
  })
  async getApplicationPipeline(@CurrentUser() user: User): Promise<{
    stages: Array<{
      stage: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const stats = await this.applicationsService.getApplicationStatistics(user);
    const total = stats.totalApplications || 1; // Avoid division by zero
    
    return {
      stages: [
        {
          stage: 'Pending',
          count: stats.pendingApplications,
          percentage: Math.round((stats.pendingApplications / total) * 100),
        },
        {
          stage: 'Reviewed',
          count: stats.reviewedApplications,
          percentage: Math.round((stats.reviewedApplications / total) * 100),
        },
        {
          stage: 'Shortlisted',
          count: stats.shortlistedApplications,
          percentage: Math.round((stats.shortlistedApplications / total) * 100),
        },
        {
          stage: 'Interviewed',
          count: stats.interviewedApplications,
          percentage: Math.round((stats.interviewedApplications / total) * 100),
        },
        {
          stage: 'Accepted',
          count: stats.acceptedApplications,
          percentage: Math.round((stats.acceptedApplications / total) * 100),
        },
      ],
    };
  }

  /**
   * Bulk update application statuses
   */
  @Put('applications/bulk-status')
  @ApiOperation({ summary: 'Bulk update application statuses' })
  @ApiResponse({
    status: 200,
    description: 'Application statuses updated successfully',
  })
  async bulkUpdateApplicationStatus(
    @CurrentUser() user: User,
    @Body(ValidationPipe) updateData: {
      applicationIds: string[];
      status: string;
      notes?: string;
    },
  ): Promise<{ message: string; updatedCount: number }> {
    return this.applicationsService.bulkUpdateApplicationStatusByOrganization(
      user,
      updateData.applicationIds,
      updateData.status,
      updateData.notes,
    );
  }

  /**
   * Get applicant profile by applicant ID
   * This allows NGOs to view full candidate profiles
   */
  @Get('applicants/:applicantId/profile')
  @ApiOperation({ summary: 'Get applicant profile by applicant ID' })
  @ApiResponse({
    status: 200,
    description: 'Applicant profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Applicant not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized - No application from this applicant' })
  async getApplicantProfile(
    @CurrentUser() user: User,
    @Param('applicantId', ParseUUIDPipe) applicantId: string,
  ): Promise<{
    profile: any;
    experiences: any[];
    educations: any[];
    certifications: any[];
    attachments: any[];
  }> {
    // Verify the NGO has at least one application from this applicant
    // Fetch applications with a higher limit to find the applicant
    const applications = await this.applicationsService.getApplicationsByOrganization(
      user,
      {},
      1,
      1000, // Fetch many to ensure we find the applicant
    );
    
    const application = applications.applications.find(
      (app) => app.applicantId === applicantId,
    );

    if (!application) {
      throw new ForbiddenException(
        'You are not authorized to view this applicant profile. No application found from this applicant.',
      );
    }

    if (!application.applicant?.applicantProfile) {
      throw new NotFoundException('Applicant profile not found');
    }

    const profile = application.applicant.applicantProfile;

    // Fetch all profile data in parallel
    const [experiences, educations, certifications, attachments] = await Promise.all([
      this.experienceService.findByUserId(applicantId).catch(() => []),
      this.educationService.findByUserId(applicantId).catch(() => []),
      this.certificationService.findAllByUserId(applicantId).catch(() => []),
      this.uploadService.listUserUploads(applicantId, 'attachment').catch(() => []),
    ]);

    return {
      profile,
      experiences,
      educations,
      certifications,
      attachments,
    };
  }
}