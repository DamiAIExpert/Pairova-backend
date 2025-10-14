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
exports.SmsLog = exports.SmsType = exports.SmsStatus = void 0;
const typeorm_1 = require("typeorm");
const sms_provider_entity_1 = require("./sms-provider.entity");
var SmsStatus;
(function (SmsStatus) {
    SmsStatus["PENDING"] = "PENDING";
    SmsStatus["SENT"] = "SENT";
    SmsStatus["DELIVERED"] = "DELIVERED";
    SmsStatus["FAILED"] = "FAILED";
    SmsStatus["EXPIRED"] = "EXPIRED";
    SmsStatus["UNKNOWN"] = "UNKNOWN";
})(SmsStatus || (exports.SmsStatus = SmsStatus = {}));
var SmsType;
(function (SmsType) {
    SmsType["VERIFICATION"] = "VERIFICATION";
    SmsType["NOTIFICATION"] = "NOTIFICATION";
    SmsType["MARKETING"] = "MARKETING";
    SmsType["ALERT"] = "ALERT";
    SmsType["REMINDER"] = "REMINDER";
    SmsType["SYSTEM"] = "SYSTEM";
})(SmsType || (exports.SmsType = SmsType = {}));
let SmsLog = class SmsLog {
    id;
    providerId;
    provider;
    recipient;
    message;
    type;
    status;
    providerMessageId;
    providerReference;
    cost;
    currency;
    errorMessage;
    errorCode;
    providerResponse;
    sentAt;
    deliveredAt;
    failedAt;
    userId;
    campaignId;
    metadata;
    createdAt;
    updatedAt;
};
exports.SmsLog = SmsLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SmsLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SmsLog.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sms_provider_entity_1.SmsProvider, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'provider_id' }),
    __metadata("design:type", sms_provider_entity_1.SmsProvider)
], SmsLog.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SmsLog.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SmsLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SmsType,
        default: SmsType.NOTIFICATION,
    }),
    __metadata("design:type", String)
], SmsLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SmsStatus,
        default: SmsStatus.PENDING,
    }),
    __metadata("design:type", String)
], SmsLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "providerMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "providerReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], SmsLog.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], SmsLog.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "errorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "providerResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SmsLog.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SmsLog.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SmsLog.prototype, "failedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], SmsLog.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SmsLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SmsLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SmsLog.prototype, "updatedAt", void 0);
exports.SmsLog = SmsLog = __decorate([
    (0, typeorm_1.Entity)('sms_logs'),
    (0, typeorm_1.Index)(['recipient']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['providerId']),
    (0, typeorm_1.Index)(['createdAt'])
], SmsLog);
//# sourceMappingURL=sms-log.entity.js.map