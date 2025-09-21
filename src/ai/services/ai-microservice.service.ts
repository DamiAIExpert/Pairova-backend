import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RecommendationScore } from '../entities/recommendation-score.entity';

/**
 * @interface AiMicroserviceConfig
 * @description Configuration for AI microservice communication
 */
export interface AiMicroserviceConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * @interface JobApplicantData
 * @description Data structure sent to AI microservice for scoring
 */
export interface JobApplicantData {
  job: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
    experienceLevel: string;
    employmentType: string;
    placement: string;
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    location: {
      country: string;
      state: string;
      city: string;
    };
    industry: string;
    orgSize: string;
    orgType: string;
  };
  applicant: {
    id: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      duration: number;
      description: string;
      skills: string[];
    }>;
    education: Array<{
      degree: string;
      field: string;
      institution: string;
      graduationYear: number;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
    location: {
      country: string;
      state: string;
      city: string;
    };
    availability: string;
    preferredSalaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    workPreferences: {
      employmentTypes: string[];
      placements: string[];
      industries: string[];
    };
  };
}

/**
 * @interface AiPredictionResponse
 * @description Response structure from AI microservice
 */
export interface AiPredictionResponse {
  score: number;
  scoreDetails: {
    skillMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
    industryMatch: number;
    educationMatch: number;
    cultureMatch: number;
    availabilityMatch: number;
    recommendationReason: string;
    skillGaps: string[];
    strengths: string[];
    improvements: string[];
  };
  modelVersion: string;
  predictionId: string;
  confidence: number;
  processingTime: number;
}

/**
 * @class AiMicroserviceService
 * @description Service for communicating with the AI microservice
 * to get job-applicant match predictions and store them in the database.
 */
@Injectable()
export class AiMicroserviceService {
  private readonly logger = new Logger(AiMicroserviceService.name);
  private readonly config: AiMicroserviceConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      baseUrl: this.configService.get<string>('AI_MICROSERVICE_URL', 'http://localhost:8000'),
      apiKey: this.configService.get<string>('AI_MICROSERVICE_API_KEY', ''),
      timeout: this.configService.get<number>('AI_MICROSERVICE_TIMEOUT', 30000),
      retryAttempts: this.configService.get<number>('AI_MICROSERVICE_RETRY_ATTEMPTS', 3),
    };
  }

  /**
   * Get prediction score from AI microservice
   * @param jobApplicantData - Job and applicant data for scoring
   * @returns Promise<AiPredictionResponse>
   */
  async getPredictionScore(
    jobApplicantData: JobApplicantData,
  ): Promise<AiPredictionResponse> {
    try {
      this.logger.log(`Requesting prediction for job ${jobApplicantData.job.id} and applicant ${jobApplicantData.applicant.id}`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/api/v1/predictions/score`,
          jobApplicantData,
          {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.timeout,
          },
        ),
      );

      if (response.status !== 200) {
        throw new HttpException(
          'AI microservice returned non-200 status',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const prediction = response.data as AiPredictionResponse;
      
      this.logger.log(`Received prediction score: ${prediction.score} for job ${jobApplicantData.job.id}`);

      return prediction;
    } catch (error) {
      this.logger.error(`Error getting prediction from AI microservice: ${error.message}`);
      
      if (error.response) {
        throw new HttpException(
          `AI microservice error: ${error.response.data?.message || error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        'Failed to communicate with AI microservice',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Get batch predictions for multiple job-applicant pairs
   * @param jobApplicantPairs - Array of job-applicant data pairs
   * @returns Promise<AiPredictionResponse[]>
   */
  async getBatchPredictions(
    jobApplicantPairs: JobApplicantData[],
  ): Promise<AiPredictionResponse[]> {
    try {
      this.logger.log(`Requesting batch predictions for ${jobApplicantPairs.length} pairs`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/api/v1/predictions/batch-score`,
          { predictions: jobApplicantPairs },
          {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.timeout * 2, // Longer timeout for batch requests
          },
        ),
      );

      if (response.status !== 200) {
        throw new HttpException(
          'AI microservice returned non-200 status for batch request',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const predictions = response.data.predictions as AiPredictionResponse[];
      
      this.logger.log(`Received ${predictions.length} batch predictions`);

      return predictions;
    } catch (error) {
      this.logger.error(`Error getting batch predictions from AI microservice: ${error.message}`);
      
      if (error.response) {
        throw new HttpException(
          `AI microservice batch error: ${error.response.data?.message || error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        'Failed to communicate with AI microservice for batch predictions',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Get job recommendations for an applicant
   * @param applicantData - Applicant profile data
   * @param limit - Number of recommendations to return
   * @returns Promise<AiPredictionResponse[]>
   */
  async getRecommendations(
    applicantData: JobApplicantData['applicant'],
    limit: number = 10,
  ): Promise<AiPredictionResponse[]> {
    try {
      this.logger.log(`Requesting recommendations for applicant ${applicantData.id}`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.config.baseUrl}/api/v1/recommendations`,
          {
            applicant: applicantData,
            limit,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: this.config.timeout,
          },
        ),
      );

      if (response.status !== 200) {
        throw new HttpException(
          'AI microservice returned non-200 status for recommendations',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const recommendations = response.data.recommendations as AiPredictionResponse[];
      
      this.logger.log(`Received ${recommendations.length} recommendations for applicant ${applicantData.id}`);

      return recommendations;
    } catch (error) {
      this.logger.error(`Error getting recommendations from AI microservice: ${error.message}`);
      
      if (error.response) {
        throw new HttpException(
          `AI microservice recommendations error: ${error.response.data?.message || error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        'Failed to get recommendations from AI microservice',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Check if AI microservice is healthy
   * @returns Promise<boolean>
   */
  async isHealthy(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.config.baseUrl}/health`, {
          timeout: 5000,
        }),
      );

      return response.status === 200;
    } catch (error) {
      this.logger.warn(`AI microservice health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Get AI microservice status and version
   * @returns Promise<{status: string, version: string, model: string}>
   */
  async getStatus(): Promise<{ status: string; version: string; model: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.config.baseUrl}/status`, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          timeout: 5000,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error getting AI microservice status: ${error.message}`);
      throw new HttpException(
        'Failed to get AI microservice status',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
