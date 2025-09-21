import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/user.enum';
import { AiService } from './ai.service';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { ScoreResultDto } from './dto/score-result.dto';
import { JobRecommendationsDto } from './dto/job-recommendations.dto';
import { MatchInsightsDto } from './dto/match-insights.dto';

/**
 * @class AiController
 * @description Controller for AI-powered job matching and recommendations.
 * Provides endpoints for calculating match scores, getting recommendations, and insights.
 */
@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Calculate match score between a job and applicant
   */
  @Post('calculate-score')
  @ApiOperation({ summary: 'Calculate AI match score between job and applicant' })
  @ApiResponse({
    status: 200,
    description: 'Match score calculated successfully',
    type: ScoreResultDto,
  })
  @ApiResponse({ status: 404, description: 'Job or applicant not found' })
  @ApiResponse({ status: 500, description: 'AI microservice error' })
  async calculateScore(
    @Body(ValidationPipe) calculateScoreDto: CalculateScoreDto,
  ): Promise<ScoreResultDto> {
    return await this.aiService.calculateScore(calculateScoreDto);
  }

  /**
   * Get AI-powered job recommendations for an applicant
   */
  @Get('recommendations/:applicantId')
  @ApiOperation({ summary: 'Get AI-powered job recommendations for applicant' })
  @ApiResponse({
    status: 200,
    description: 'Recommendations retrieved successfully',
    type: JobRecommendationsDto,
  })
  @ApiResponse({ status: 404, description: 'Applicant not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations to return' })
  async getRecommendations(
    @Param('applicantId', ParseUUIDPipe) applicantId: string,
    @Request() req,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<JobRecommendationsDto> {
    return await this.aiService.getRecommendations(applicantId, req.user, limit);
  }

  /**
   * Get match insights for an applicant
   */
  @Get('match-insights/:applicantId')
  @ApiOperation({ summary: 'Get detailed match insights for applicant' })
  @ApiResponse({
    status: 200,
    description: 'Match insights retrieved successfully',
    type: MatchInsightsDto,
  })
  @ApiResponse({ status: 404, description: 'Applicant not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  async getMatchInsights(
    @Param('applicantId', ParseUUIDPipe) applicantId: string,
    @Request() req,
  ): Promise<MatchInsightsDto> {
    return await this.aiService.getMatchInsights(applicantId, req.user);
  }

  /**
   * Get top candidates for a job
   */
  @Get('top-candidates/:jobId')
  @ApiOperation({ summary: 'Get top candidates for a job based on AI scores' })
  @ApiResponse({
    status: 200,
    description: 'Top candidates retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of candidates to return' })
  async getTopCandidates(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<any[]> {
    return await this.aiService.getTopCandidates(jobId, limit);
  }

  /**
   * Get AI service status and health
   */
  @Get('status')
  @ApiOperation({ summary: 'Get AI microservice status and cache statistics' })
  @ApiResponse({
    status: 200,
    description: 'AI service status retrieved successfully',
  })
  @Roles(Role.ADMIN)
  async getAiServiceStatus(): Promise<any> {
    return await this.aiService.getAiServiceStatus();
  }

  /**
   * Clean up expired predictions
   */
  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up expired prediction cache entries' })
  @ApiResponse({
    status: 200,
    description: 'Expired predictions cleaned up successfully',
  })
  @Roles(Role.ADMIN)
  async cleanupExpiredPredictions(): Promise<{ cleaned: number }> {
    const cleaned = await this.aiService.cleanupExpiredPredictions();
    return { cleaned };
  }
}
