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

  /**
   * Granular Privacy Category Settings
   * @description Controls which specific data categories can be used for AI recommendations
   */
  @ApiProperty({ 
    description: 'Allow personal information (name, email, phone) to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowPersonalInformation?: boolean;

  @ApiProperty({ 
    description: 'Allow gender data to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowGenderData?: boolean;

  @ApiProperty({ 
    description: 'Allow location data (country, state, city) to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowLocation?: boolean;

  @ApiProperty({ 
    description: 'Allow work experience data to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowExperience?: boolean;

  @ApiProperty({ 
    description: 'Allow skills data to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowSkills?: boolean;

  @ApiProperty({ 
    description: 'Allow certificates data to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowCertificates?: boolean;

  @ApiProperty({ 
    description: 'Allow bio/profile description to be used for AI recommendations',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  allowBio?: boolean;
}



