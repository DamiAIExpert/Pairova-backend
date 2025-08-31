// src/ai/dto/score-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * @class ScoreRequestDto
 * @description Data Transfer Object for requesting an AI match score between a job and an applicant.
 */
export class ScoreRequestDto {
  @ApiProperty({
    description: 'The UUID of the job to be scored.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  jobId: string;

  @ApiProperty({
    description: 'The UUID of the applicant user to be scored against the job.',
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  @IsUUID()
  applicantId: string;
}
