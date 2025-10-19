import { ApiProperty } from '@nestjs/swagger';
import { JobRecommendationDto } from './job-recommendation.dto';

export class JobRecommendationsDto {
  @ApiProperty({
    description: 'The applicant ID for these recommendations',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  applicantId: string;

  @ApiProperty({
    description: 'Array of job recommendations for the applicant',
    type: [JobRecommendationDto],
  })
  recommendations: JobRecommendationDto[];

  @ApiProperty({
    description: 'Total number of recommendations found',
    example: 15,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Timestamp when recommendations were generated',
    example: '2024-01-15T10:30:00Z',
  })
  generatedAt: Date;

  @ApiProperty({
    description: 'Metadata about the recommendation algorithm used',
    example: {
      algorithm: 'hybrid',
      version: '1.2.0',
      confidence: 0.85,
    },
  })
  metadata: {
    algorithm: string;
    version: string;
    confidence: number;
  };
}
