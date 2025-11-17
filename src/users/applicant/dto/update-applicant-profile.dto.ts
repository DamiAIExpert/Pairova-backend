// src/users/applicant/dto/update-applicant-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsUrl, Length, IsArray } from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';

/**
 * @class UpdateApplicantProfileDto
 * @description DTO for updating an applicant's profile. All fields are optional.
 */
export class UpdateApplicantProfileDto {
  @ApiProperty({ description: "Applicant's first name", example: 'Jane', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: "Applicant's last name", example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ enum: Gender, description: 'Gender identity', example: Gender.FEMALE, required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)', example: '1995-08-24', required: false })
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiProperty({ description: 'A short professional biography', example: 'Experienced NestJS developer...', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Country of residence', example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'State or province', example: 'Lagos', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'City of residence', example: 'Ikeja', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Postal or ZIP code', example: '100001', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ description: 'Current work position or job title', example: 'Software Engineer', required: false })
  @IsString()
  @IsOptional()
  workPosition?: string;

  @ApiProperty({ description: 'URL to profile photo', example: 'https://cdn.pairova.com/photo.jpg', required: false })
  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ description: 'URL to an external portfolio', example: 'https://github.com/janedoe', required: false })
  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;

  @ApiProperty({ 
    description: 'Array of skills (hard/soft skills and technical skills)', 
    example: ['JavaScript', 'React', 'Communication', 'Leadership'], 
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
