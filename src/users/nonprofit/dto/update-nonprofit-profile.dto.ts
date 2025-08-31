// src/users/nonprofit/dto/update-nonprofit-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsDateString, Length } from 'class-validator';

/**
 * @class UpdateNonprofitProfileDto
 * @description DTO for updating a non-profit organization's profile. All fields are optional.
 */
export class UpdateNonprofitProfileDto {
  @ApiProperty({ description: "Organization's name", example: 'Pairova Foundation', required: false })
  @IsString()
  @IsOptional()
  orgName?: string;

  @ApiProperty({ description: 'URL to the organization logo', example: 'https://cdn.pairova.com/logo.png', required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ description: 'Official website URL', example: 'https://pairova.org', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'The mission statement of the organization', required: false })
  @IsString()
  @Length(20, 1000)
  @IsOptional()
  mission?: string;

  @ApiProperty({ description: 'The core values of the organization', required: false })
  @IsString()
  @Length(20, 1000)
  @IsOptional()
  values?: string;

  @ApiProperty({ description: 'Company size category', example: '50-100 employees', required: false })
  @IsString()
  @IsOptional()
  sizeLabel?: string;

  @ApiProperty({ description: 'Type of organization', example: 'Non-Governmental Organization', required: false })
  @IsString()
  @IsOptional()
  orgType?: string;

  @ApiProperty({ description: 'Industry sector', example: 'Social Services', required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ description: 'Date the organization was founded (YYYY-MM-DD)', example: '2020-01-15', required: false })
  @IsDateString()
  @IsOptional()
  foundedOn?: Date;

  @ApiProperty({ description: 'Tax identification number', example: 'AB-123456789', required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ description: 'Country where the organization is based', example: 'Nigeria', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'State or province', example: 'Abuja', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'City', example: 'Garki', required: false })
  @IsString()
  @IsOptional()
  city?: string;
}
