// src/ai/dto/calculate-score.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CalculateScoreDto {
  @ApiProperty({ description: 'Applicant ID' })
  @IsString()
  @IsUUID()
  applicantId: string;

  @ApiProperty({ description: 'Job ID' })
  @IsString()
  @IsUUID()
  jobId: string;
}

export class ScoreResultDto {
  @ApiProperty({ description: 'Overall compatibility score (0-100)' })
  score: number;

  @ApiProperty({ description: 'Score breakdown by category' })
  breakdown: {
    skills: {
      score: number;
      matched: string[];
      missing: string[];
    };
    experience: {
      score: number;
      level: string;
      years: number;
    };
    location: {
      score: number;
      match: boolean;
      distance?: number;
    };
    preferences: {
      score: number;
      employmentType: boolean;
      placement: boolean;
    };
  };

  @ApiProperty({ description: 'Detailed explanations for the score' })
  explanations: string[];

  @ApiProperty({ description: 'Recommendations for improvement' })
  recommendations: string[];

  @ApiProperty({ description: 'Confidence level of the match' })
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty({ description: 'Timestamp of calculation' })
  calculatedAt: Date;
}
