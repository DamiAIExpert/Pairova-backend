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
exports.User = exports.Role = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
var role_enum_2 = require("../../common/enums/role.enum");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return role_enum_2.Role; } });
const applicant_entity_1 = require("../applicant/applicant.entity");
const nonprofit_entity_1 = require("../nonprofit/nonprofit.entity");
let User = class User {
    id;
    role;
    email;
    passwordHash;
    phone;
    isVerified;
    hasCompletedOnboarding;
    emailVerificationToken;
    oauthProvider;
    oauthId;
    oauthProfile;
    lastLoginAt;
    createdAt;
    updatedAt;
    applicantProfile;
    nonprofitOrg;
    get nonprofitProfile() {
        return this.nonprofitOrg;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: role_enum_1.Role,
        comment: 'Defines if the user is an ADMIN, APPLICANT, or NONPROFIT.',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255, select: false, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_verified', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_completed_onboarding', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasCompletedOnboarding", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verification_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_provider', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "oauthProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "oauthId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oauth_profile', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "oauthProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => applicant_entity_1.ApplicantProfile, (profile) => profile.user, { cascade: true }),
    __metadata("design:type", applicant_entity_1.ApplicantProfile)
], User.prototype, "applicantProfile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => nonprofit_entity_1.NonprofitOrg, (org) => org.user, { cascade: true }),
    __metadata("design:type", nonprofit_entity_1.NonprofitOrg)
], User.prototype, "nonprofitOrg", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map