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
exports.Reminder = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const channel_type_enum_1 = require("../../common/enums/channel-type.enum");
let Reminder = class Reminder {
    id;
    userId;
    user;
    channel;
    subject;
    payload;
    scheduledAt;
    sentAt;
    createdAt;
};
exports.Reminder = Reminder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reminder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Reminder.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE', nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Reminder.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: channel_type_enum_1.ChannelType }),
    __metadata("design:type", String)
], Reminder.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Reminder.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Reminder.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'scheduled_at' }),
    __metadata("design:type", Date)
], Reminder.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'sent_at', nullable: true }),
    __metadata("design:type", Date)
], Reminder.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Reminder.prototype, "createdAt", void 0);
exports.Reminder = Reminder = __decorate([
    (0, typeorm_1.Entity)('reminders'),
    (0, typeorm_1.Index)(['userId', 'scheduledAt'])
], Reminder);
//# sourceMappingURL=reminder.entity.js.map