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
exports.SmsProvider = exports.SmsProviderStatus = exports.SmsProviderType = void 0;
const typeorm_1 = require("typeorm");
var SmsProviderType;
(function (SmsProviderType) {
    SmsProviderType["TWILIO"] = "TWILIO";
    SmsProviderType["CLICKATELL"] = "CLICKATELL";
    SmsProviderType["MSG91"] = "MSG91";
    SmsProviderType["NEXMO"] = "NEXMO";
    SmsProviderType["AFRICASTALKING"] = "AFRICASTALKING";
    SmsProviderType["CM_COM"] = "CM_COM";
    SmsProviderType["TELESIGN"] = "TELESIGN";
})(SmsProviderType || (exports.SmsProviderType = SmsProviderType = {}));
var SmsProviderStatus;
(function (SmsProviderStatus) {
    SmsProviderStatus["ACTIVE"] = "ACTIVE";
    SmsProviderStatus["INACTIVE"] = "INACTIVE";
    SmsProviderStatus["MAINTENANCE"] = "MAINTENANCE";
    SmsProviderStatus["ERROR"] = "ERROR";
})(SmsProviderStatus || (exports.SmsProviderStatus = SmsProviderStatus = {}));
let SmsProvider = class SmsProvider {
    id;
    providerType;
    status;
    name;
    description;
    configuration;
    isActive;
    priority;
    isEnabled;
    costPerSms;
    currency;
    supportedCountries;
    supportedFeatures;
    lastHealthCheck;
    isHealthy;
    totalSent;
    totalDelivered;
    deliveryRate;
    totalErrors;
    lastError;
    lastUsed;
    metadata;
    createdAt;
    updatedAt;
};
exports.SmsProvider = SmsProvider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SmsProvider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SmsProviderType,
    }),
    __metadata("design:type", String)
], SmsProvider.prototype, "providerType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SmsProviderStatus,
        default: SmsProviderStatus.INACTIVE,
    }),
    __metadata("design:type", String)
], SmsProvider.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SmsProvider.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SmsProvider.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SmsProvider.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SmsProvider.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SmsProvider.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "costPerSms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'USD' }),
    __metadata("design:type", String)
], SmsProvider.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, array: true, default: '{}' }),
    __metadata("design:type", Array)
], SmsProvider.prototype, "supportedCountries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, array: true, default: '{}' }),
    __metadata("design:type", Array)
], SmsProvider.prototype, "supportedFeatures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SmsProvider.prototype, "lastHealthCheck", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SmsProvider.prototype, "isHealthy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "totalSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "totalDelivered", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "deliveryRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SmsProvider.prototype, "totalErrors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], SmsProvider.prototype, "lastError", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SmsProvider.prototype, "lastUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SmsProvider.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SmsProvider.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], SmsProvider.prototype, "updatedAt", void 0);
exports.SmsProvider = SmsProvider = __decorate([
    (0, typeorm_1.Entity)('sms_providers'),
    (0, typeorm_1.Index)(['isActive', 'priority']),
    (0, typeorm_1.Index)(['providerType'])
], SmsProvider);
//# sourceMappingURL=sms-provider.entity.js.map