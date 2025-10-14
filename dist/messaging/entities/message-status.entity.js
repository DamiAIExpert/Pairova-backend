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
exports.MessageStatus = exports.MessageStatusType = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
const user_entity_1 = require("../../users/shared/user.entity");
var MessageStatusType;
(function (MessageStatusType) {
    MessageStatusType["SENT"] = "SENT";
    MessageStatusType["DELIVERED"] = "DELIVERED";
    MessageStatusType["READ"] = "READ";
    MessageStatusType["FAILED"] = "FAILED";
})(MessageStatusType || (exports.MessageStatusType = MessageStatusType = {}));
let MessageStatus = class MessageStatus {
    id;
    messageId;
    message;
    userId;
    user;
    status;
    createdAt;
    updatedAt;
};
exports.MessageStatus = MessageStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageStatus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageStatus.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => message_entity_1.Message, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'message_id' }),
    __metadata("design:type", message_entity_1.Message)
], MessageStatus.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageStatus.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], MessageStatus.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageStatusType,
        default: MessageStatusType.SENT,
    }),
    __metadata("design:type", String)
], MessageStatus.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MessageStatus.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], MessageStatus.prototype, "updatedAt", void 0);
exports.MessageStatus = MessageStatus = __decorate([
    (0, typeorm_1.Entity)('message_status'),
    (0, typeorm_1.Unique)(['messageId', 'userId']),
    (0, typeorm_1.Index)(['messageId', 'status']),
    (0, typeorm_1.Index)(['userId', 'status'])
], MessageStatus);
//# sourceMappingURL=message-status.entity.js.map