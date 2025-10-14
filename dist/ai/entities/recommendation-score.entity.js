"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationScore = void 0;
const typeorm_1 = require("typeorm");
const job_entity_1 = require("../../jobs/entities/job.entity");
const user_entity_1 = require("../../users/shared/user.entity");
let RecommendationScore = class RecommendationScore {
    id;
    jobId;
    job;
    applicantId;
    applicant;
    score;
    scoreDetails;
    modelVersion;
    predictionSource;
    isActive;
    expiresAt;
    createdAt;
};
exports.RecommendationScore = RecommendationScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RecommendationScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], RecommendationScore.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_entity_1.Job, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'job_id' }),
    __metadata("design:type", job_entity_1.Job)
], RecommendationScore.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], RecommendationScore.prototype, "applicantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'applicant_id' }),
    __metadata("design:type", user_entity_1.User)
], RecommendationScore.prototype, "applicant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], RecommendationScore.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], RecommendationScore.prototype, "scoreDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], RecommendationScore.prototype, "modelVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], RecommendationScore.prototype, "predictionSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], RecommendationScore.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], RecommendationScore.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], RecommendationScore.prototype, "createdAt", void 0);
exports.RecommendationScore = RecommendationScore = __decorate([
    (0, typeorm_1.Entity)('recommendation_scores'),
    (0, typeorm_1.Unique)(['jobId', 'applicantId']),
    (0, typeorm_1.Index)(['applicantId', 'createdAt']),
    (0, typeorm_1.Index)(['jobId', 'createdAt'])
], RecommendationScore);
//# sourceMappingURL=recommendation-score.entity.js.map