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
exports.Interview = exports.InterviewStatus = void 0;
const typeorm_1 = require("typeorm");
const application_entity_1 = require("../../../jobs/entities/application.entity");
const user_entity_1 = require("../../../users/shared/user.entity");
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "SCHEDULED";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["CANCELED"] = "CANCELED";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
let Interview = class Interview {
    id;
    applicationId;
    application;
    scheduledById;
    scheduledBy;
    startAt;
    endAt;
    meetingLink;
    status;
    createdAt;
};
exports.Interview = Interview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Interview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Interview.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => application_entity_1.Application, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'application_id' }),
    __metadata("design:type", application_entity_1.Application)
], Interview.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Interview.prototype, "scheduledById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'scheduled_by' }),
    __metadata("design:type", user_entity_1.User)
], Interview.prototype, "scheduledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Interview.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Interview.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "meetingLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, default: InterviewStatus.SCHEDULED }),
    __metadata("design:type", String)
], Interview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Interview.prototype, "createdAt", void 0);
exports.Interview = Interview = __decorate([
    (0, typeorm_1.Entity)('interviews')
], Interview);
//# sourceMappingURL=interview.entity.js.map