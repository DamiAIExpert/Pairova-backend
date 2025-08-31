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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
const user_entity_1 = require("../../users/shared/user.entity");
const message_enum_1 = require("../../common/enums/message.enum");
const upload_entity_1 = require("../../profiles/uploads/entities/upload.entity");
let Message = class Message {
    id;
    conversationId;
    conversation;
    senderId;
    sender;
    type;
    content;
    attachmentId;
    attachment;
    sentAt;
    isDeleted;
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'conversation_id' }),
    __metadata("design:type", String)
], Message.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, (c) => c.messages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], Message.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sender_id' }),
    __metadata("design:type", String)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: message_enum_1.MessageType, default: message_enum_1.MessageType.TEXT }),
    __metadata("design:type", String)
], Message.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'attachment_id' }),
    __metadata("design:type", String)
], Message.prototype, "attachmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => upload_entity_1.Upload, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'attachment_id' }),
    __metadata("design:type", upload_entity_1.Upload)
], Message.prototype, "attachment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'sent_at' }),
    __metadata("design:type", Date)
], Message.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Message.prototype, "isDeleted", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('messages')
], Message);
//# sourceMappingURL=message.entity.js.map