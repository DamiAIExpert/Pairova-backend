// src/admin/job-seekers/dto/admin-job-seeker.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../common/enums/gender.enum';
import { ApplicationStatus } from '../../../jobs/entities/application.entity';

export class AdminJobSeekerDto {
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

  // Profile information
  @ApiProperty({ description: 'First name', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Full name (computed)' })
  name: string;

  @ApiProperty({ description: 'Gender', enum: Gender, required: false })
  gender?: Gender;

  @ApiProperty({ description: 'Date of birth', required: false })
  dob?: Date;

  @ApiProperty({ description: 'Bio/description', required: false })
  bio?: string;

  @ApiProperty({ description: 'Country', required: false })
  country?: string;

  @ApiProperty({ description: 'State', required: false })
  state?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'Profile photo URL', required: false })
  photoUrl?: string;

  @ApiProperty({ description: 'Portfolio URL', required: false })
  portfolioUrl?: string;

  @ApiProperty({ description: 'Total number of applications' })
  applicationCount: number;

  @ApiProperty({ description: 'Average match score', required: false })
  averageMatchScore?: number;

  @ApiProperty({ description: 'Application date (most recent)', required: false })
  applicationDate?: string;

  @ApiProperty({ description: 'Current application status', required: false })
  currentStatus?: ApplicationStatus;
}

export class AdminJobSeekerListDto {
  @ApiProperty({ type: [AdminJobSeekerDto], description: 'List of job seekers' })
  data: AdminJobSeekerDto[];

  @ApiProperty({ description: 'Total number of job seekers' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class AppliedJobDto {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ description: 'Job ID' })
  jobId: string;

  @ApiProperty({ description: 'Job title' })
  jobTitle: string;

  @ApiProperty({ description: 'Organization name' })
  orgName: string;

  @ApiProperty({ description: 'Application status', enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty({ description: 'Application date' })
  appliedAt: Date;

  @ApiProperty({ description: 'Match score', required: false })
  matchScore?: number;
}

export class AppliedJobsListDto {
  @ApiProperty({ type: [AppliedJobDto], description: 'List of applied jobs' })
  data: AppliedJobDto[];

  @ApiProperty({ description: 'Total number of applications' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}
