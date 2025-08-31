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
exports.SmsSettings = void 0;
const typeorm_1 = require("typeorm");
const sms_provider_enum_1 = require("../../../common/enums/sms-provider.enum");
const sms_status_enum_1 = require("../../../common/enums/sms-status.enum");
let SmsSettings = class SmsSettings {
    id;
    provider;
    apiKeyEnc;
    senderId;
    country;
    priority;
    status;
    testingMode;
    createdBy;
    createdAt;
};
exports.SmsSettings = SmsSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SmsSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: sms_provider_enum_1.SmsProvider }),
    __metadata("design:type", String)
], SmsSettings.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'api_key_enc', type: 'text', comment: 'Encrypted API Key/Secret' }),
    __metadata("design:type", String)
], SmsSettings.prototype, "apiKeyEnc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id', length: 32 }),
    __metadata("design:type", String)
], SmsSettings.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], SmsSettings.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], SmsSettings.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: sms_status_enum_1.SmsStatus, default: sms_status_enum_1.SmsStatus.INACTIVE }),
    __metadata("design:type", String)
], SmsSettings.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'testing_mode', default: false }),
    __metadata("design:type", Boolean)
], SmsSettings.prototype, "testingMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], SmsSettings.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SmsSettings.prototype, "createdAt", void 0);
exports.SmsSettings = SmsSettings = __decorate([
    (0, typeorm_1.Entity)('sms_settings')
], SmsSettings);
//# sourceMappingURL=sms-settings.entity.js.map