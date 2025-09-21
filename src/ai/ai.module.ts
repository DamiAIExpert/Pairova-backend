import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiMicroserviceService } from './services/ai-microservice.service';
import { PredictionCacheService } from './services/prediction-cache.service';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { User } from '../users/shared/user.entity';
import { ApplicantProfile } from '../users/applicant/applicant.entity';
import { NonprofitOrg } from '../users/nonprofit/nonprofit.entity';
import { RecommendationScore } from './entities/recommendation-score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      Application,
      User,
      ApplicantProfile,
      NonprofitOrg,
      RecommendationScore,
    ]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AiController],
  providers: [AiService, AiMicroserviceService, PredictionCacheService],
  exports: [AiService, AiMicroserviceService, PredictionCacheService],
})
export class AiModule {}
