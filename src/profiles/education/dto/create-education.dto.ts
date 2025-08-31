// src/profiles/education/dto/create-education.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, MaxLength } from 'class-validator';

/**
 * @class CreateEducationDto
 * @description Data transfer object for creating a new education entry.
 */
export class CreateEducationDto {
  @ApiProperty({ description: 'Name of the school or institution.', example: 'University of Lagos' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  school: string;

  @ApiProperty({ description: 'Degree obtained.', example: 'Bachelor of Science', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  degree?: string;

  @ApiProperty({ description: 'Field of study.', example: 'Computer Science', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fieldOfStudy?: string;

  @ApiProperty({ description: 'Grade or result.', example: 'First Class Honours', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  grade?: string;

  @ApiProperty({ description: 'Start date of education.', example: '2016-09-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ description: 'End date of education.', example: '2020-06-30', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
