"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
let ScoringService = class ScoringService {
    score(job, profile) {
        let s = 50;
        const skills = new Set((profile?.skills || []).map((x) => x.toLowerCase()));
        for (const r of (job?.requiredSkills || [])) {
            if (skills.has(String(r).toLowerCase()))
                s += 10;
        }
        return Math.max(0, Math.min(100, s));
    }
    explain(job, profile) {
        const reasons = [];
        const skills = new Set((profile?.skills || []).map((x) => x.toLowerCase()));
        for (const r of (job?.requiredSkills || [])) {
            reasons.push(skills.has(String(r).toLowerCase())
                ? `Matched skill: ${r}`
                : `Missing skill: ${r}`);
        }
        return reasons;
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)()
], ScoringService);
//# sourceMappingURL=scoring.service.js.map