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
exports.Feedback = exports.FeedbackCategory = exports.FeedbackPriority = exports.FeedbackStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../users/shared/user.entity");
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus["PENDING"] = "PENDING";
    FeedbackStatus["IN_REVIEW"] = "IN_REVIEW";
    FeedbackStatus["RESOLVED"] = "RESOLVED";
    FeedbackStatus["CLOSED"] = "CLOSED";
})(FeedbackStatus || (exports.FeedbackStatus = FeedbackStatus = {}));
var FeedbackPriority;
(function (FeedbackPriority) {
    FeedbackPriority["LOW"] = "LOW";
    FeedbackPriority["MEDIUM"] = "MEDIUM";
    FeedbackPriority["HIGH"] = "HIGH";
    FeedbackPriority["URGENT"] = "URGENT";
})(FeedbackPriority || (exports.FeedbackPriority = FeedbackPriority = {}));
var FeedbackCategory;
(function (FeedbackCategory) {
    FeedbackCategory["BUG_REPORT"] = "BUG_REPORT";
    FeedbackCategory["FEATURE_REQUEST"] = "FEATURE_REQUEST";
    FeedbackCategory["USER_EXPERIENCE"] = "USER_EXPERIENCE";
    FeedbackCategory["PERFORMANCE"] = "PERFORMANCE";
    FeedbackCategory["SECURITY"] = "SECURITY";
    FeedbackCategory["GENERAL"] = "GENERAL";
})(FeedbackCategory || (exports.FeedbackCategory = FeedbackCategory = {}));
let Feedback = class Feedback {
    id;
    title;
    description;
    category;
    status;
    priority;
    userEmail;
    userName;
    userId;
    user;
    adminNotes;
    assignedToId;
    assignedTo;
    browserInfo;
    deviceInfo;
    pageUrl;
    metadata;
    createdAt;
    updatedAt;
};
exports.Feedback = Feedback;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Feedback.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Feedback.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeedbackCategory,
        default: FeedbackCategory.GENERAL,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeedbackStatus,
        default: FeedbackStatus.PENDING,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FeedbackPriority,
        default: FeedbackPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Feedback.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", user_entity_1.User)
], Feedback.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "browserInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "deviceInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "pageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Feedback.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Feedback.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Feedback.prototype, "updatedAt", void 0);
exports.Feedback = Feedback = __decorate([
    (0, typeorm_1.Entity)('feedback')
], Feedback);
//# sourceMappingURL=feedback.entity.js.map