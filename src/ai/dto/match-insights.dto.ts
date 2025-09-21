// src/ai/dto/match-insights.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MatchInsightsDto {
  @ApiProperty({ description: 'Applicant ID' })
  applicantId: string;

  @ApiProperty({ description: 'Total jobs analyzed' })
  totalJobsAnalyzed: number;

  @ApiProperty({ description: 'Average match score' })
  averageMatchScore: number;

  @ApiProperty({ description: 'Top matching industries' })
  topIndustries: Array<{
    industry: string;
    averageScore: number;
    jobCount: number;
  }>;

  @ApiProperty({ description: 'Skills analysis' })
  skillsAnalysis: {
    strongSkills: string[];
    missingSkills: string[];
    skillGaps: Array<{
      skill: string;
      demand: number;
      currentLevel: number;
    }>;
  };

  @ApiProperty({ description: 'Location preferences' })
  locationInsights: {
    preferredLocations: string[];
    remoteWorkPreference: boolean;
    locationScoreDistribution: Array<{
      location: string;
      averageScore: number;
    }>;
  };

  @ApiProperty({ description: 'Experience level insights' })
  experienceInsights: {
    currentLevel: string;
    targetLevel: string;
    yearsOfExperience: number;
    recommendedLevel: string;
  };

  @ApiProperty({ description: 'Salary expectations analysis' })
  salaryInsights: {
    expectedRange: {
      min: number;
      max: number;
      currency: string;
    };
    marketAverage: number;
    recommendation: string;
  };

  @ApiProperty({ description: 'Career progression recommendations' })
  careerRecommendations: {
    nextSteps: string[];
    skillDevelopment: string[];
    experienceGaps: string[];
    networkingOpportunities: string[];
  };

  @ApiProperty({ description: 'Market trends relevant to the applicant' })
  marketTrends: {
    growingSkills: string[];
    decliningSkills: string[];
    emergingOpportunities: string[];
    salaryTrends: string;
  };
}

export class JobRecommendationDto {
  @ApiProperty({ description: 'Job ID' })
  jobId: string;

  @ApiProperty({ description: 'Job title' })
  title: string;

  @ApiProperty({ description: 'Organization name' })
  orgName: string;

  @ApiProperty({ description: 'Match score (0-100)' })
  matchScore: number;

  @ApiProperty({ description: 'Why this job is recommended' })
  reasoning: string[];

  @ApiProperty({ description: 'Key matching factors' })
  matchingFactors: {
    skills: string[];
    location: boolean;
    experience: boolean;
    preferences: boolean;
  };

  @ApiProperty({ description: 'Potential concerns or gaps' })
  concerns: string[];

  @ApiProperty({ description: 'Job location' })
  location: string;

  @ApiProperty({ description: 'Employment type' })
  employmentType: string;

  @ApiProperty({ description: 'Salary range', required: false })
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };

  @ApiProperty({ description: 'Date posted' })
  postedAt: Date;
}

export class JobRecommendationsDto {
  @ApiProperty({ description: 'Applicant ID' })
  applicantId: string;

  @ApiProperty({ description: 'List of recommended jobs', type: [JobRecommendationDto] })
  recommendations: JobRecommendationDto[];

  @ApiProperty({ description: 'Total recommendations found' })
  total: number;

  @ApiProperty({ description: 'Algorithm used for recommendations' })
  algorithm: string;

  @ApiProperty({ description: 'Timestamp of recommendation generation' })
  generatedAt: Date;

  @ApiProperty({ description: 'Personalization level' })
  personalizationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class CandidateMatchDto {
  @ApiProperty({ description: 'Applicant ID' })
  applicantId: string;

  @ApiProperty({ description: 'Applicant name' })
  name: string;

  @ApiProperty({ description: 'Match score (0-100)' })
  matchScore: number;

  @ApiProperty({ description: 'Key strengths' })
  strengths: string[];

  @ApiProperty({ description: 'Potential concerns' })
  concerns: string[];

  @ApiProperty({ description: 'Years of experience' })
  yearsOfExperience: number;

  @ApiProperty({ description: 'Current location' })
  location: string;

  @ApiProperty({ description: 'Skills match percentage' })
  skillsMatchPercentage: number;

  @ApiProperty({ description: 'Profile completeness' })
  profileCompleteness: number;
}
