// src/jobs/dto/create-job.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  IsUUID,
} from 'class-validator';
import {
  EmploymentType,
  JobPlacement,
  JobStatus,
} from '../../common/enums/job.enum';

export class CreateJobDto {
  @ApiProperty({ description: 'The title of the job.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A detailed description of the job role.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: JobPlacement,
    description: 'The work placement model (e.g., Onsite, Remote).',
    required: false,
  })
  @IsOptional()
  @IsEnum(JobPlacement)
  placement?: JobPlacement;

  @ApiProperty({
    enum: EmploymentType,
    description: 'The type of employment (e.g., Full-time, Contract).',
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiProperty({
    description: 'Minimum years of experience required.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceMinYrs?: number;

  @ApiProperty({ description: "The job's location city.", required: false })
  @IsOptional()
  @IsString()
  locationCity?: string;

  @ApiProperty({ description: "The job's location state.", required: false })
  @IsOptional()
  @IsString()
  locationState?: string;

  @ApiProperty({ description: "The job's location country.", required: false })
  @IsOptional()
  @IsString()
  locationCountry?: string;

  @ApiProperty({ description: 'The minimum salary for the role.', required: false })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiProperty({ description: 'The maximum salary for the role.', required: false })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiProperty({ description: 'The currency for the salary.', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    enum: JobStatus,
    description: "The initial status of the job (e.g., 'DRAFT', 'PUBLISHED').",
    required: false,
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
