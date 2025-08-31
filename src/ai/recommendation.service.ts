import { Injectable } from '@nestjs/common';
import { ScoringService } from './scoring.service.js';

@Injectable()
export class RecommendationService {
  constructor(private readonly scoring: ScoringService) {}
  recommend(job: any, profile: any) {
    const score = this.scoring.score(job, profile);
    return { score, explanation: this.scoring.explain(job, profile) };
  }
}
