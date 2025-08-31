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
exports.Otp = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/shared/user.entity");
const otp_channel_enum_1 = require("../../common/enums/otp-channel.enum");
let Otp = class Otp {
    id;
    userId;
    user;
    channel;
    codeHash;
    expiresAt;
    consumedAt;
    createdAt;
};
exports.Otp = Otp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Otp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Otp.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Otp.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: otp_channel_enum_1.OtpChannel }),
    __metadata("design:type", String)
], Otp.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'code_hash' }),
    __metadata("design:type", String)
], Otp.prototype, "codeHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'expires_at' }),
    __metadata("design:type", Date)
], Otp.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'consumed_at', nullable: true }),
    __metadata("design:type", Date)
], Otp.prototype, "consumedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Otp.prototype, "createdAt", void 0);
exports.Otp = Otp = __decorate([
    (0, typeorm_1.Entity)('otps'),
    (0, typeorm_1.Index)(['userId', 'channel'])
], Otp);
//# sourceMappingURL=otp.entity.js.map