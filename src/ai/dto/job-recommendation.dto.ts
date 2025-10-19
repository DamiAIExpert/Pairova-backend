import { ApiProperty } from '@nestjs/swagger';

export class JobRecommendationDto {
  @ApiProperty({
    description: 'Unique identifier of the job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobId: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Developer',
  })
  title: string;

  @ApiProperty({
    description: 'Job description',
    example: 'We are looking for a senior software developer...',
  })
  description: string;

  @ApiProperty({
    description: 'Organization name that posted the job',
    example: 'Tech for Good Foundation',
  })
  orgName: string;

  @ApiProperty({
    description: 'Job location',
    example: 'San Francisco, CA',
  })
  location: string;

  @ApiProperty({
    description: 'Employment type',
    example: 'FULL_TIME',
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP'],
  })
  employmentType: string;

  @ApiProperty({
    description: 'Match score for this recommendation',
    example: 87.5,
    minimum: 0,
    maximum: 100,
  })
  matchScore: number;

  @ApiProperty({
    description: 'Why this job was recommended',
    example: 'Strong match based on your Python and React skills',
  })
  reason: string;

  @ApiProperty({
    description: 'Job posting date',
    example: '2024-01-10T09:00:00Z',
  })
  postedAt: Date;

  @ApiProperty({
    description: 'Application deadline',
    example: '2024-02-15T23:59:59Z',
    nullable: true,
  })
  deadline?: Date;

  @ApiProperty({
    description: 'Salary range if available',
    example: {
      min: 80000,
      max: 120000,
      currency: 'USD',
    },
    nullable: true,
  })
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}
