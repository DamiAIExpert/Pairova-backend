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
exports.Job = void 0;
const typeorm_1 = require("typeorm");
const nonprofit_entity_1 = require("../../users/nonprofit/nonprofit.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const job_enum_1 = require("../../common/enums/job.enum");
const application_entity_1 = require("./application.entity");
let Job = class Job {
    id;
    orgUserId;
    organization;
    title;
    description;
    placement;
    employmentType;
    experienceMinYrs;
    locationCity;
    locationState;
    locationCountry;
    salaryMin;
    salaryMax;
    currency;
    status;
    createdBy;
    creator;
    applications;
    createdAt;
    updatedAt;
    publishedAt;
};
exports.Job = Job;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Job.prototype, "orgUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nonprofit_entity_1.NonprofitOrg, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'org_user_id', referencedColumnName: 'userId' }),
    __metadata("design:type", nonprofit_entity_1.NonprofitOrg)
], Job.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: job_enum_1.JobPlacement, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "placement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: job_enum_1.EmploymentType, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "experienceMinYrs", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "locationCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "locationState", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "locationCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 14, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "salaryMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 14, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Job.prototype, "salaryMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: job_enum_1.JobStatus, default: job_enum_1.JobStatus.DRAFT }),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Job.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Job.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.job),
    __metadata("design:type", Array)
], Job.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Job.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Job.prototype, "publishedAt", void 0);
exports.Job = Job = __decorate([
    (0, typeorm_1.Entity)('jobs')
], Job);
//# sourceMappingURL=job.entity.js.map