import { ApiProperty } from '@nestjs/swagger';

export class ScoreResultDto {
  @ApiProperty({
    description: 'The job ID for this score',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobId: string;

  @ApiProperty({
    description: 'The applicant ID for this score',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  applicantId: string;

  @ApiProperty({
    description: 'The calculated match score between job and applicant',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  score: number;

  @ApiProperty({
    description: 'Detailed breakdown of the scoring factors',
    example: {
      skillsMatch: 90,
      experienceMatch: 80,
      locationMatch: 85,
      educationMatch: 75,
    },
  })
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    educationMatch: number;
  };

  @ApiProperty({
    description: 'Explanation of why this score was given',
    example: 'High match due to strong skills alignment and relevant experience',
  })
  explanation: string;

  @ApiProperty({
    description: 'Detailed score breakdown and analysis',
    example: {
      skillsMatch: 90,
      experienceMatch: 80,
      locationMatch: 85,
      educationMatch: 75,
    },
  })
  scoreDetails: any;

  @ApiProperty({
    description: 'Model version used for scoring',
    example: '1.2.0',
  })
  modelVersion: string;

  @ApiProperty({
    description: 'Source of the prediction (cache, ai_microservice, etc.)',
    example: 'ai_microservice',
  })
  predictionSource: string;

  @ApiProperty({
    description: 'Timestamp when the score was calculated',
    example: '2024-01-15T10:30:00Z',
  })
  calculatedAt: Date;
}
