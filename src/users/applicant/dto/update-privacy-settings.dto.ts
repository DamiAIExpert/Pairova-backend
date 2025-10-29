// src/users/applicant/dto/update-privacy-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * @class UpdatePrivacySettingsDto
 * @description DTO for updating an applicant's privacy settings.
 * Controls how their data is used across the platform.
 */
export class UpdatePrivacySettingsDto {
  @ApiProperty({ 
    description: 'Allow data to be used for AI model training and improvement',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowAiTraining?: boolean;

  @ApiProperty({ 
    description: 'Allow profile to be indexed and shown in search results',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowProfileIndexing?: boolean;

  @ApiProperty({ 
    description: 'Allow data to be used for analytics and insights',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowDataAnalytics?: boolean;

  @ApiProperty({ 
    description: 'Allow data to be shared with third-party partners',
    example: false,
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  allowThirdPartySharing?: boolean;
}



