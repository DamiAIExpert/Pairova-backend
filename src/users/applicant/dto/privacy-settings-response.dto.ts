// src/users/applicant/dto/privacy-settings-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class PrivacySettingsResponseDto
 * @description Response DTO for privacy settings, including metadata about when settings were last updated.
 */
export class PrivacySettingsResponseDto {
  @ApiProperty({ 
    description: 'Allow data to be used for AI model training and improvement',
    example: true
  })
  allowAiTraining: boolean;

  @ApiProperty({ 
    description: 'Allow profile to be indexed and shown in search results',
    example: true
  })
  allowProfileIndexing: boolean;

  @ApiProperty({ 
    description: 'Allow data to be used for analytics and insights',
    example: true
  })
  allowDataAnalytics: boolean;

  @ApiProperty({ 
    description: 'Allow data to be shared with third-party partners',
    example: false
  })
  allowThirdPartySharing: boolean;

  @ApiProperty({ 
    description: 'Timestamp of the last privacy settings update',
    example: '2024-01-15T10:30:00Z',
    nullable: true
  })
  privacyUpdatedAt: Date | null;

  @ApiProperty({ 
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  /**
   * Granular Privacy Category Settings
   * @description Which specific data categories can be used for AI recommendations
   */
  @ApiProperty({ 
    description: 'Allow personal information (name, email, phone) to be used for AI recommendations',
    example: true
  })
  allowPersonalInformation: boolean;

  @ApiProperty({ 
    description: 'Allow gender data to be used for AI recommendations',
    example: true
  })
  allowGenderData: boolean;

  @ApiProperty({ 
    description: 'Allow location data (country, state, city) to be used for AI recommendations',
    example: true
  })
  allowLocation: boolean;

  @ApiProperty({ 
    description: 'Allow work experience data to be used for AI recommendations',
    example: true
  })
  allowExperience: boolean;

  @ApiProperty({ 
    description: 'Allow skills data to be used for AI recommendations',
    example: true
  })
  allowSkills: boolean;

  @ApiProperty({ 
    description: 'Allow certificates data to be used for AI recommendations',
    example: true
  })
  allowCertificates: boolean;

  @ApiProperty({ 
    description: 'Allow bio/profile description to be used for AI recommendations',
    example: true
  })
  allowBio: boolean;
}



