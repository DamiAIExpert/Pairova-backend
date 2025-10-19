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
exports.NotificationPreferences = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
let NotificationPreferences = class NotificationPreferences {
    id;
    userId;
    user;
    emailEnabled;
    emailJobMatches;
    emailApplicationUpdates;
    emailInterviews;
    emailMessages;
    emailSystem;
    pushEnabled;
    pushJobMatches;
    pushApplicationUpdates;
    pushInterviews;
    pushMessages;
    pushSystem;
    smsEnabled;
    smsJobMatches;
    smsApplicationUpdates;
    smsInterviews;
    smsMessages;
    smsSystem;
    remindersEnabled;
    createdAt;
    updatedAt;
};
exports.NotificationPreferences = NotificationPreferences;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificationPreferences.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    __metadata("design:type", String)
], NotificationPreferences.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], NotificationPreferences.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_enabled', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_job_matches', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailJobMatches", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_application_updates', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailApplicationUpdates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_interviews', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailInterviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_messages', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_system', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "emailSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_enabled', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_job_matches', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushJobMatches", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_application_updates', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushApplicationUpdates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_interviews', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushInterviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_messages', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_system', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "pushSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_enabled', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_job_matches', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsJobMatches", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_application_updates', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsApplicationUpdates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_interviews', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsInterviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_messages', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsMessages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_system', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "smsSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminders_enabled', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreferences.prototype, "remindersEnabled", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NotificationPreferences.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NotificationPreferences.prototype, "updatedAt", void 0);
exports.NotificationPreferences = NotificationPreferences = __decorate([
    (0, typeorm_1.Entity)('notification_preferences')
], NotificationPreferences);
//# sourceMappingURL=notification-preferences.entity.js.map