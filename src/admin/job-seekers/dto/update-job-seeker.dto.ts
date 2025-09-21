// src/admin/job-seekers/dto/update-job-seeker.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';

export class UpdateJobSeekerDto {
  @ApiProperty({ description: 'Whether to verify the user', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'User phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Gender', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ description: 'Date of birth (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({ description: 'Bio/description', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Portfolio URL', required: false })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}
