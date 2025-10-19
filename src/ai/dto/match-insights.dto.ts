import { ApiProperty } from '@nestjs/swagger';

export class MatchInsightsDto {
  @ApiProperty({
    description: 'The applicant ID for these insights',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  applicantId: string;

  @ApiProperty({
    description: 'Total number of applications analyzed',
    example: 25,
  })
  totalApplications: number;

  @ApiProperty({
    description: 'Total number of jobs analyzed',
    example: 150,
  })
  totalJobsAnalyzed: number;

  @ApiProperty({
    description: 'Average match score across all applications',
    example: 78.5,
  })
  averageMatchScore: number;

  @ApiProperty({
    description: 'Top skills identified',
    example: ['JavaScript', 'React', 'Node.js'],
  })
  topSkills: string[];

  @ApiProperty({
    description: 'Skill gaps identified',
    example: ['TypeScript', 'AWS'],
  })
  skillGaps: string[];

  @ApiProperty({
    description: 'Top industries the applicant has applied to',
    example: ['Technology', 'Healthcare', 'Education'],
  })
  topIndustries: string[];

  @ApiProperty({
    description: 'Industry preferences based on applications',
    example: ['Technology', 'Healthcare'],
  })
  industryPreferences: string[];

  @ApiProperty({
    description: 'Location preferences based on applications',
    example: ['San Francisco', 'New York', 'Remote'],
  })
  locationPreferences: string[];

  @ApiProperty({
    description: 'Salary expectations analysis',
    example: {
      min: 80000,
      max: 120000,
      currency: 'USD',
    },
  })
  salaryExpectations: any;

  @ApiProperty({
    description: 'Skills analysis details',
    example: {
      strengths: ['JavaScript', 'React'],
      weaknesses: ['TypeScript', 'AWS'],
      recommendations: ['Learn TypeScript', 'Get AWS certification'],
    },
  })
  skillsAnalysis: any;

  @ApiProperty({
    description: 'Location insights',
    example: {
      preferredCities: ['San Francisco', 'New York'],
      remoteWorkPreference: 0.8,
    },
  })
  locationInsights: any;

  @ApiProperty({
    description: 'Market trends analysis',
    example: {
      demandTrend: 'increasing',
      salaryTrend: 'stable',
      skillDemand: ['React', 'Node.js', 'TypeScript'],
    },
  })
  marketTrends: any;

  @ApiProperty({
    description: 'Improvement suggestions',
    example: ['Learn TypeScript', 'Get AWS certification', 'Improve soft skills'],
  })
  improvementSuggestions: string[];

  @ApiProperty({
    description: 'Timestamp when insights were generated',
    example: '2024-01-15T10:30:00Z',
  })
  generatedAt: Date;
}