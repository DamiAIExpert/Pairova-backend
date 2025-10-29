// src/jobs/dto/create-comprehensive-application.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsEmail, 
  IsBoolean, 
  IsArray, 
  ValidateNested,
  IsDateString 
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExperienceEntryDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  company: string;

  @ApiProperty({ description: 'Job position/title' })
  @IsString()
  position: string;

  @ApiProperty({ description: 'Employment type' })
  @IsString()
  employmentType: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: 'Currently working here', required: false })
  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Job description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class EducationEntryDto {
  @ApiProperty({ description: 'School/University name' })
  @IsString()
  school: string;

  @ApiProperty({ description: 'Degree', required: false })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiProperty({ description: 'Field of study', required: false })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({ description: 'Start date', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: 'Grade/GPA', required: false })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CertificationEntryDto {
  @ApiProperty({ description: 'Certification name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Issuing organization', required: false })
  @IsOptional()
  @IsString()
  issuingOrganization?: string;

  @ApiProperty({ description: 'Issue date', required: false })
  @IsOptional()
  @IsString()
  issueDate?: string;

  @ApiProperty({ description: 'Credential ID', required: false })
  @IsOptional()
  @IsString()
  credentialId?: string;

  @ApiProperty({ description: 'Credential URL', required: false })
  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @ApiProperty({ description: 'Certificate file upload ID', required: false })
  @IsOptional()
  @IsUUID()
  fileUploadId?: string;
}

export class CreateComprehensiveApplicationDto {
  @ApiProperty({ description: 'The ID of the job being applied for (UUID or demo ID).' })
  @IsString()
  @IsNotEmpty()
  jobId: string;

  // Basic application data
  @ApiProperty({ description: 'Cover letter', required: false })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ description: 'Resume upload ID', required: false })
  @IsOptional()
  @IsUUID()
  resumeUploadId?: string;

  // Personal details
  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'LinkedIn URL', required: false })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiProperty({ description: 'Portfolio URL', required: false })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiProperty({ description: 'Years of experience', required: false })
  @IsOptional()
  @IsString()
  yearsOfExperience?: string;

  @ApiProperty({ description: 'Current employer', required: false })
  @IsOptional()
  @IsString()
  currentEmployer?: string;

  @ApiProperty({ description: 'Expected salary', required: false })
  @IsOptional()
  @IsString()
  expectedSalary?: string;

  @ApiProperty({ description: 'Availability date', required: false })
  @IsOptional()
  @IsString()
  availabilityDate?: string;

  @ApiProperty({ description: 'Willing to relocate', required: false })
  @IsOptional()
  @IsBoolean()
  willingToRelocate?: boolean;

  @ApiProperty({ description: 'Reference contact', required: false })
  @IsOptional()
  @IsString()
  referenceContact?: string;

  // Dynamic sections
  @ApiProperty({ 
    description: 'Experience entries', 
    type: [ExperienceEntryDto],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceEntryDto)
  experiences?: ExperienceEntryDto[];

  @ApiProperty({ 
    description: 'Education entries', 
    type: [EducationEntryDto],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  education?: EducationEntryDto[];

  @ApiProperty({ 
    description: 'Certification entries', 
    type: [CertificationEntryDto],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationEntryDto)
  certifications?: CertificationEntryDto[];

  @ApiProperty({ 
    description: 'Hard/Soft skills', 
    type: [String],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hardSkills?: string[];

  @ApiProperty({ 
    description: 'Technical skills', 
    type: [String],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techSkills?: string[];
}

