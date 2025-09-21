// src/admin/ngos/dto/admin-ngo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '../../../jobs/entities/job.entity';
import { ApplicationStatus } from '../../../jobs/entities/application.entity';

export class AdminNgoDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'Whether user is verified' })
  isVerified: boolean;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Account creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  // NGO Profile information
  @ApiProperty({ description: 'Organization name' })
  orgName: string;

  @ApiProperty({ description: 'Organization logo URL', required: false })
  logoUrl?: string;

  @ApiProperty({ description: 'Organization website', required: false })
  website?: string;

  @ApiProperty({ description: 'Organization mission', required: false })
  mission?: string;

  @ApiProperty({ description: 'Organization values', required: false })
  values?: string;

  @ApiProperty({ description: 'Organization size label', required: false })
  sizeLabel?: string;

  @ApiProperty({ description: 'Organization type', required: false })
  orgType?: string;

  @ApiProperty({ description: 'Industry', required: false })
  industry?: string;

  @ApiProperty({ description: 'Founded date', required: false })
  foundedOn?: Date;

  @ApiProperty({ description: 'Tax ID', required: false })
  taxId?: string;

  @ApiProperty({ description: 'Country', required: false })
  country?: string;

  @ApiProperty({ description: 'State', required: false })
  state?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'Address line 1', required: false })
  addressLine1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  addressLine2?: string;

  @ApiProperty({ description: 'Total number of jobs posted' })
  jobCount: number;

  @ApiProperty({ description: 'Total number of applications received' })
  applicationCount: number;

  @ApiProperty({ description: 'Number of active jobs' })
  activeJobCount: number;
}

export class AdminNgoListDto {
  @ApiProperty({ type: [AdminNgoDto], description: 'List of NGOs' })
  data: AdminNgoDto[];

  @ApiProperty({ description: 'Total number of NGOs' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class NgoJobDto {
  @ApiProperty({ description: 'Job ID' })
  id: string;

  @ApiProperty({ description: 'Job title' })
  title: string;

  @ApiProperty({ description: 'Job description' })
  description: string;

  @ApiProperty({ description: 'Employment type' })
  employmentType: string;

  @ApiProperty({ description: 'Job placement (remote/onsite/hybrid)' })
  placement: string;

  @ApiProperty({ description: 'Job status', enum: JobStatus })
  status: JobStatus;

  @ApiProperty({ description: 'Date posted' })
  postedAt: Date;

  @ApiProperty({ description: 'Number of applications received' })
  applicationCount: number;
}

export class NgoJobsListDto {
  @ApiProperty({ type: [NgoJobDto], description: 'List of jobs' })
  data: NgoJobDto[];

  @ApiProperty({ description: 'Total number of jobs' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class JobApplicantDto {
  @ApiProperty({ description: 'Application ID' })
  applicationId: string;

  @ApiProperty({ description: 'Applicant ID' })
  applicantId: string;

  @ApiProperty({ description: 'Applicant name' })
  applicantName: string;

  @ApiProperty({ description: 'Applicant email' })
  applicantEmail: string;

  @ApiProperty({ description: 'Application status', enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ description: 'Application date' })
  appliedAt: Date;

  @ApiProperty({ description: 'Match score', required: false })
  matchScore?: number;

  @ApiProperty({ description: 'Applicant photo URL', required: false })
  photoUrl?: string;
}

export class JobApplicantsListDto {
  @ApiProperty({ type: [JobApplicantDto], description: 'List of job applicants' })
  data: JobApplicantDto[];

  @ApiProperty({ description: 'Total number of applicants' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class NgoStatisticsDto {
  @ApiProperty({ description: 'Total jobs posted' })
  totalJobs: number;

  @ApiProperty({ description: 'Active jobs' })
  activeJobs: number;

  @ApiProperty({ description: 'Total applications received' })
  totalApplications: number;

  @ApiProperty({ description: 'Applications by status' })
  applicationsByStatus: Record<ApplicationStatus, number>;

  @ApiProperty({ description: 'Jobs by status' })
  jobsByStatus: Record<JobStatus, number>;

  @ApiProperty({ description: 'Average applications per job' })
  averageApplicationsPerJob: number;

  @ApiProperty({ description: 'Hiring rate (percentage)' })
  hiringRate: number;
}
