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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const audit_action_enum_1 = require("../../../common/enums/audit-action.enum");
let AuditLog = class AuditLog {
    id;
    timestamp;
    adminId;
    action;
    resourceType;
    resourceId;
    reason;
    beforeData;
    afterData;
    ipAddress;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'admin_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: audit_action_enum_1.AuditAction }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resource_type', length: 64 }),
    __metadata("design:type", String)
], AuditLog.prototype, "resourceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resource_id', length: 128, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "resourceId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'before_data', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "beforeData", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'after_data', nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "afterData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'inet', name: 'ip_address', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)('audit_logs')
], AuditLog);
//# sourceMappingURL=audit-log.entity.js.map