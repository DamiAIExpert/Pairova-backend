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
  IsArray,
  IsDateString,
} from 'class-validator';
import {
  EmploymentType,
  JobPlacement,
  JobStatus,
} from '../../common/enums/job.enum';

export class CreateJobDto {
  @ApiProperty({ 
    description: 'The title of the job posting. Should be clear and descriptive.',
    example: 'Senior Software Developer',
    minLength: 5,
    maxLength: 100,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Job title is required' })
  title: string;

  @ApiProperty({ 
    description: 'A detailed description of the job role, responsibilities, and requirements. Use markdown formatting for better readability.',
    example: 'We are looking for a Senior Software Developer to join our team...\n\n**Responsibilities:**\n- Develop and maintain web applications\n- Collaborate with cross-functional teams\n\n**Requirements:**\n- 5+ years of experience\n- Proficiency in JavaScript/TypeScript',
    minLength: 50,
    maxLength: 5000,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Job description is required' })
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

  @ApiProperty({
    description: 'Maximum years of experience required.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceMaxYrs?: number;

  @ApiProperty({
    description: 'Experience level (e.g., "1-3 years", "Entry Level", "Senior").',
    required: false,
  })
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @ApiProperty({
    description: 'List of required skills for the job.',
    type: [String],
    required: false,
    example: ['JavaScript', 'React', 'Node.js'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiProperty({
    description: 'List of hard and soft skills required for the job.',
    type: [String],
    required: false,
    example: ['Communication', 'Problem-Solving', 'Leadership'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hardSoftSkills?: string[];

  @ApiProperty({
    description: 'Qualifications required for the job (multiline text).',
    required: false,
    example: 'At least 1-3 years of experience in administration...\nA degree or diploma in Business Administration...',
  })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @ApiProperty({
    description: 'Responsibilities for the job role (multiline text).',
    required: false,
    example: 'Maintain accurate records and documentation...\nAssist with fundraising activities...',
  })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiProperty({
    description: 'Mission statement for the job or organization.',
    required: false,
    example: 'Our mission is to empower communities and drive positive change...',
  })
  @IsOptional()
  @IsString()
  missionStatement?: string;

  @ApiProperty({
    description: 'List of benefits offered with the job.',
    type: [String],
    required: false,
    example: ['Health Insurance', 'Remote Work', 'Flexible Hours'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiProperty({
    description: 'Application deadline for the job posting.',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

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

  @ApiProperty({ description: "The job's postal/zip code.", required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

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
