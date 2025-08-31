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
exports.Conversation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const job_entity_1 = require("../../jobs/entities/job.entity");
const conversation_participant_entity_1 = require("./conversation-participant.entity");
const message_entity_1 = require("./message.entity");
let Conversation = class Conversation {
    id;
    createdByUserId;
    createdBy;
    relatedJobId;
    relatedJob;
    messages;
    participants;
    isGroup;
    createdAt;
};
exports.Conversation = Conversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "createdByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'related_job_id', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "relatedJobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_entity_1.Job),
    (0, typeorm_1.JoinColumn)({ name: 'related_job_id' }),
    __metadata("design:type", job_entity_1.Job)
], Conversation.prototype, "relatedJob", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_participant_entity_1.ConversationParticipant, (participant) => participant.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "isGroup", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
exports.Conversation = Conversation = __decorate([
    (0, typeorm_1.Entity)('conversations')
], Conversation);
//# sourceMappingURL=conversation.entity.js.map