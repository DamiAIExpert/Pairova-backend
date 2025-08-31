import { Injectable } from '@nestjs/common';

@Injectable()
export class ScoringService {
  score(job: any, profile: any): number {
    let s = 50;
    const skills = new Set((profile?.skills || []).map((x: string) => x.toLowerCase()));
    for (const r of (job?.requiredSkills || [])) {
      if (skills.has(String(r).toLowerCase())) s += 10;
    }
    return Math.max(0, Math.min(100, s));
  }
  explain(job: any, profile: any): string[] {
    const reasons: string[] = [];
    const skills = new Set((profile?.skills || []).map((x: string) => x.toLowerCase()));
    for (const r of (job?.requiredSkills || [])) {
      reasons.push(skills.has(String(r).toLowerCase())
        ? `Matched skill: ${r}`
        : `Missing skill: ${r}`);
    }
    return reasons;
  }
}
