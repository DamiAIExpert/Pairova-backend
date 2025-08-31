// src/profiles/experience/dto/create-experience.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, MaxLength } from 'class-validator';
import { EmploymentType } from '../../../common/enums/employment-type.enum';

/**
 * @class CreateExperienceDto
 * @description Data transfer object for creating a new work experience entry.
 */
export class CreateExperienceDto {
  @ApiProperty({ description: 'Name of the company.', example: 'Pairova Inc.' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  company: string;

  @ApiProperty({ description: 'Job title or role.', example: 'Software Engineer' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  roleTitle: string;

  @ApiProperty({ enum: EmploymentType, description: 'Type of employment.', example: EmploymentType.FULL_TIME, required: false })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiProperty({ description: 'City of employment.', example: 'Lagos', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  locationCity?: string;
  
  @ApiProperty({ description: 'Start date of employment.', example: '2021-01-15', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ description: 'End date of employment (leave empty if current).', example: '2023-08-30', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Description of responsibilities and achievements.', example: 'Developed key features for the main platform.', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
