// src/admin/applications/dto/admin-application.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../jobs/entities/application.entity';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { JobPlacement } from '../../../common/enums/job.enum';

export class AdminApplicationDto {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ description: 'Application status', enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ description: 'Application creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Application last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Cover letter', required: false })
  coverLetter?: string;

  @ApiProperty({ description: 'Resume URL', required: false })
  resumeUrl?: string;

  // Applicant information
  @ApiProperty({ description: 'Applicant ID' })
  applicantId: string;

  @ApiProperty({ description: 'Applicant name' })
  applicantName: string;

  @ApiProperty({ description: 'Applicant email' })
  applicantEmail: string;

  @ApiProperty({ description: 'Applicant photo URL', required: false })
  applicantPhotoUrl?: string;

  @ApiProperty({ description: 'Applicant phone', required: false })
  applicantPhone?: string;

  @ApiProperty({ description: 'Applicant location', required: false })
  applicantLocation?: string;

  // Job information
  @ApiProperty({ description: 'Job ID' })
  jobId: string;

  @ApiProperty({ description: 'Job title' })
  jobTitle: string;

  @ApiProperty({ description: 'Job description' })
  jobDescription: string;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiProperty({ description: 'Job placement', enum: JobPlacement })
  placement: JobPlacement;

  // NGO information
  @ApiProperty({ description: 'NGO ID' })
  ngoId: string;

  @ApiProperty({ description: 'NGO name' })
  ngoName: string;

  @ApiProperty({ description: 'NGO logo URL', required: false })
  ngoLogoUrl?: string;

  @ApiProperty({ description: 'NGO location', required: false })
  ngoLocation?: string;

  @ApiProperty({ description: 'Match score', required: false })
  matchScore?: number;

  @ApiProperty({ description: 'Days since application' })
  daysSinceApplication: number;
}

export class AdminApplicationListDto {
  @ApiProperty({ type: [AdminApplicationDto], description: 'List of applications' })
  data: AdminApplicationDto[];

  @ApiProperty({ description: 'Total number of applications' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ description: 'New application status', enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ description: 'Admin notes about the status change', required: false })
  notes?: string;
}

export class ApplicationPipelineDto {
  @ApiProperty({ description: 'Applications pending review' })
  pending: number;

  @ApiProperty({ description: 'Applications under review' })
  underReview: number;

  @ApiProperty({ description: 'Applications in interview stage' })
  interview: number;

  @ApiProperty({ description: 'Applications hired' })
  hired: number;

  @ApiProperty({ description: 'Applications denied' })
  denied: number;

  @ApiProperty({ description: 'Applications withdrawn' })
  withdrawn: number;

  @ApiProperty({ description: 'Total applications' })
  total: number;

  @ApiProperty({ description: 'Hiring rate percentage' })
  hiringRate: number;

  @ApiProperty({ description: 'Average time to hire (days)', required: false })
  averageTimeToHire?: number;
}

export class ApplicationStatisticsDto {
  @ApiProperty({ description: 'Total applications' })
  totalApplications: number;

  @ApiProperty({ description: 'Applications this month' })
  applicationsThisMonth: number;

  @ApiProperty({ description: 'Applications by status' })
  applicationsByStatus: Record<ApplicationStatus, number>;

  @ApiProperty({ description: 'Average applications per job' })
  averageApplicationsPerJob: number;

  @ApiProperty({ description: 'Top performing jobs (by application count)' })
  topJobs: Array<{
    jobId: string;
    jobTitle: string;
    ngoName: string;
    applicationCount: number;
  }>;

  @ApiProperty({ description: 'Hiring rate percentage' })
  hiringRate: number;

  @ApiProperty({ description: 'Average time to hire (days)', required: false })
  averageTimeToHire?: number;
}
