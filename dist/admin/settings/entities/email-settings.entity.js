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
exports.EmailSettings = void 0;
const typeorm_1 = require("typeorm");
const provider_type_enum_1 = require("../../../common/enums/provider-type.enum");
let EmailSettings = class EmailSettings {
    id;
    provider;
    smtpHost;
    smtpPort;
    username;
    passwordEnc;
    fromAddress;
    secureTls;
    testingMode;
    createdBy;
    createdAt;
};
exports.EmailSettings = EmailSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmailSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: provider_type_enum_1.ProviderType, default: provider_type_enum_1.ProviderType.SMTP }),
    __metadata("design:type", String)
], EmailSettings.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_host', length: 255, nullable: true }),
    __metadata("design:type", String)
], EmailSettings.prototype, "smtpHost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'smtp_port', nullable: true }),
    __metadata("design:type", Number)
], EmailSettings.prototype, "smtpPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], EmailSettings.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_enc', type: 'text', nullable: true, comment: 'Encrypted password/API key' }),
    __metadata("design:type", String)
], EmailSettings.prototype, "passwordEnc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_address', length: 255 }),
    __metadata("design:type", String)
], EmailSettings.prototype, "fromAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secure_tls', default: true }),
    __metadata("design:type", Boolean)
], EmailSettings.prototype, "secureTls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'testing_mode', default: false }),
    __metadata("design:type", Boolean)
], EmailSettings.prototype, "testingMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], EmailSettings.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], EmailSettings.prototype, "createdAt", void 0);
exports.EmailSettings = EmailSettings = __decorate([
    (0, typeorm_1.Entity)('email_settings')
], EmailSettings);
//# sourceMappingURL=email-settings.entity.js.map