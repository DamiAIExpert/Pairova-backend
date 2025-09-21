import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationScore } from '../entities/recommendation-score.entity';
import { AiMicroserviceService, AiPredictionResponse, JobApplicantData } from './ai-microservice.service';

/**
 * @interface CachedPrediction
 * @description Cached prediction with metadata
 */
export interface CachedPrediction {
  score: number;
  scoreDetails: any;
  modelVersion: string;
  predictionSource: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

/**
 * @class PredictionCacheService
 * @description Service for managing AI prediction caching and retrieval.
 * Provides intelligent caching strategy with fallback to AI microservice.
 */
@Injectable()
export class PredictionCacheService {
  private readonly logger = new Logger(PredictionCacheService.name);
  private readonly CACHE_DURATION_HOURS = 24; // Cache predictions for 24 hours

  constructor(
    @InjectRepository(RecommendationScore)
    private readonly recommendationScoreRepository: Repository<RecommendationScore>,
    private readonly aiMicroserviceService: AiMicroserviceService,
  ) {}

  /**
   * Get prediction score with caching strategy
   * @param jobId - Job ID
   * @param applicantId - Applicant ID
   * @param jobApplicantData - Data for AI microservice (if cache miss)
   * @returns Promise<CachedPrediction>
   */
  async getPredictionScore(
    jobId: string,
    applicantId: string,
    jobApplicantData?: JobApplicantData,
  ): Promise<CachedPrediction> {
    try {
      // First, try to get from cache
      const cachedPrediction = await this.getCachedPrediction(jobId, applicantId);
      
      if (cachedPrediction && this.isCacheValid(cachedPrediction)) {
        this.logger.log(`Cache hit for job ${jobId} and applicant ${applicantId}`);
        return cachedPrediction;
      }

      // Cache miss or expired - get from AI microservice
      if (!jobApplicantData) {
        throw new Error('Job applicant data is required when cache is unavailable');
      }

      this.logger.log(`Cache miss for job ${jobId} and applicant ${applicantId}, fetching from AI microservice`);

      const aiPrediction = await this.aiMicroserviceService.getPredictionScore(jobApplicantData);
      
      // Store in cache
      const cachedPrediction = await this.storePrediction(
        jobId,
        applicantId,
        aiPrediction,
        'ai_microservice',
      );

      return cachedPrediction;
    } catch (error) {
      this.logger.error(`Error getting prediction score: ${error.message}`);
      
      // Fallback to cached prediction even if expired
      const cachedPrediction = await this.getCachedPrediction(jobId, applicantId);
      if (cachedPrediction) {
        this.logger.warn(`Using expired cache for job ${jobId} and applicant ${applicantId}`);
        return cachedPrediction;
      }

      throw error;
    }
  }

  /**
   * Get cached prediction from database
   * @param jobId - Job ID
   * @param applicantId - Applicant ID
   * @returns Promise<CachedPrediction | null>
   */
  private async getCachedPrediction(
    jobId: string,
    applicantId: string,
  ): Promise<CachedPrediction | null> {
    const recommendationScore = await this.recommendationScoreRepository.findOne({
      where: {
        jobId,
        applicantId,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!recommendationScore) {
      return null;
    }

    return {
      score: recommendationScore.score,
      scoreDetails: recommendationScore.scoreDetails,
      modelVersion: recommendationScore.modelVersion,
      predictionSource: recommendationScore.predictionSource,
      isActive: recommendationScore.isActive,
      expiresAt: recommendationScore.expiresAt,
      createdAt: recommendationScore.createdAt,
    };
  }

  /**
   * Store prediction in cache
   * @param jobId - Job ID
   * @param applicantId - Applicant ID
   * @param aiPrediction - AI microservice response
   * @param source - Prediction source
   * @returns Promise<CachedPrediction>
   */
  async storePrediction(
    jobId: string,
    applicantId: string,
    aiPrediction: AiPredictionResponse,
    source: string = 'ai_microservice',
  ): Promise<CachedPrediction> {
    try {
      // Deactivate existing predictions
      await this.recommendationScoreRepository.update(
        { jobId, applicantId },
        { isActive: false },
      );

      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_DURATION_HOURS);

      // Create new prediction record
      const recommendationScore = this.recommendationScoreRepository.create({
        jobId,
        applicantId,
        score: aiPrediction.score,
        scoreDetails: aiPrediction.scoreDetails,
        modelVersion: aiPrediction.modelVersion,
        predictionSource: source,
        isActive: true,
        expiresAt,
      });

      const savedPrediction = await this.recommendationScoreRepository.save(recommendationScore);

      this.logger.log(`Stored prediction for job ${jobId} and applicant ${applicantId} with score ${aiPrediction.score}`);

      return {
        score: savedPrediction.score,
        scoreDetails: savedPrediction.scoreDetails,
        modelVersion: savedPrediction.modelVersion,
        predictionSource: savedPrediction.predictionSource,
        isActive: savedPrediction.isActive,
        expiresAt: savedPrediction.expiresAt,
        createdAt: savedPrediction.createdAt,
      };
    } catch (error) {
      this.logger.error(`Error storing prediction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if cached prediction is still valid
   * @param prediction - Cached prediction
   * @returns boolean
   */
  private isCacheValid(prediction: CachedPrediction): boolean {
    if (!prediction.expiresAt) {
      return true; // No expiration set
    }

    return new Date() < prediction.expiresAt;
  }

  /**
   * Get batch predictions with caching
   * @param jobApplicantPairs - Array of job-applicant pairs
   * @returns Promise<CachedPrediction[]>
   */
  async getBatchPredictions(
    jobApplicantPairs: Array<{
      jobId: string;
      applicantId: string;
      data: JobApplicantData;
    }>,
  ): Promise<CachedPrediction[]> {
    const results: CachedPrediction[] = [];
    const cacheMisses: Array<{
      jobId: string;
      applicantId: string;
      data: JobApplicantData;
    }> = [];

    // Check cache for all pairs
    for (const pair of jobApplicantPairs) {
      const cachedPrediction = await this.getCachedPrediction(pair.jobId, pair.applicantId);
      
      if (cachedPrediction && this.isCacheValid(cachedPrediction)) {
        results.push(cachedPrediction);
      } else {
        cacheMisses.push(pair);
      }
    }

    // Fetch cache misses from AI microservice
    if (cacheMisses.length > 0) {
      this.logger.log(`Fetching ${cacheMisses.length} predictions from AI microservice`);

      try {
        const aiPredictions = await this.aiMicroserviceService.getBatchPredictions(
          cacheMisses.map(pair => pair.data),
        );

        // Store new predictions and add to results
        for (let i = 0; i < cacheMisses.length; i++) {
          const pair = cacheMisses[i];
          const aiPrediction = aiPredictions[i];

          const cachedPrediction = await this.storePrediction(
            pair.jobId,
            pair.applicantId,
            aiPrediction,
            'ai_microservice',
          );

          results.push(cachedPrediction);
        }
      } catch (error) {
        this.logger.error(`Error fetching batch predictions: ${error.message}`);
        
        // Add expired cache entries as fallback
        for (const pair of cacheMisses) {
          const expiredCache = await this.getCachedPrediction(pair.jobId, pair.applicantId);
          if (expiredCache) {
            results.push(expiredCache);
          }
        }
      }
    }

    return results;
  }

  /**
   * Clean up expired predictions
   * @returns Promise<number> - Number of cleaned up predictions
   */
  async cleanupExpiredPredictions(): Promise<number> {
    const result = await this.recommendationScoreRepository.update(
      {
        expiresAt: new Date(),
        isActive: true,
      },
      {
        isActive: false,
      },
    );

    this.logger.log(`Cleaned up ${result.affected} expired predictions`);
    return result.affected || 0;
  }

  /**
   * Get prediction statistics
   * @returns Promise<{total: number, active: number, expired: number}>
   */
  async getPredictionStats(): Promise<{ total: number; active: number; expired: number }> {
    const total = await this.recommendationScoreRepository.count();
    const active = await this.recommendationScoreRepository.count({ where: { isActive: true } });
    const expired = await this.recommendationScoreRepository.count({
      where: {
        expiresAt: new Date(),
        isActive: true,
      },
    });

    return { total, active, expired };
  }

  /**
   * Invalidate cache for specific job-applicant pair
   * @param jobId - Job ID
   * @param applicantId - Applicant ID
   * @returns Promise<boolean>
   */
  async invalidateCache(jobId: string, applicantId: string): Promise<boolean> {
    const result = await this.recommendationScoreRepository.update(
      { jobId, applicantId },
      { isActive: false },
    );

    this.logger.log(`Invalidated cache for job ${jobId} and applicant ${applicantId}`);
    return (result.affected || 0) > 0;
  }
}
