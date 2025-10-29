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
}



