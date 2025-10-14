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
exports.Conversation = exports.ConversationStatus = exports.ConversationType = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
const conversation_participant_entity_1 = require("./conversation-participant.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
var ConversationType;
(function (ConversationType) {
    ConversationType["DIRECT"] = "DIRECT";
    ConversationType["JOB_RELATED"] = "JOB_RELATED";
    ConversationType["INTERVIEW"] = "INTERVIEW";
    ConversationType["SUPPORT"] = "SUPPORT";
})(ConversationType || (exports.ConversationType = ConversationType = {}));
var ConversationStatus;
(function (ConversationStatus) {
    ConversationStatus["ACTIVE"] = "ACTIVE";
    ConversationStatus["ARCHIVED"] = "ARCHIVED";
    ConversationStatus["BLOCKED"] = "BLOCKED";
    ConversationStatus["DELETED"] = "DELETED";
})(ConversationStatus || (exports.ConversationStatus = ConversationStatus = {}));
let Conversation = class Conversation {
    id;
    type;
    status;
    title;
    description;
    jobId;
    job;
    createdById;
    createdBy;
    isArchived;
    lastMessageAt;
    metadata;
    messages;
    participants;
    createdAt;
    updatedAt;
};
exports.Conversation = Conversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConversationType,
        default: ConversationType.DIRECT,
    }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConversationStatus,
        default: ConversationStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Conversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_entity_1.Job, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'job_id' }),
    __metadata("design:type", job_entity_1.Job)
], Conversation.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "isArchived", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Conversation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Conversation.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_participant_entity_1.ConversationParticipant, (participant) => participant.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Conversation.prototype, "updatedAt", void 0);
exports.Conversation = Conversation = __decorate([
    (0, typeorm_1.Entity)('conversations'),
    (0, typeorm_1.Index)(['status', 'createdAt']),
    (0, typeorm_1.Index)(['type', 'createdAt'])
], Conversation);
//# sourceMappingURL=conversation.entity.js.map