import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service.js';
import { ScoringService } from './scoring.service.js';

@Module({
  providers: [RecommendationService, ScoringService],
  exports: [RecommendationService, ScoringService],
})
export class AiModule {}
