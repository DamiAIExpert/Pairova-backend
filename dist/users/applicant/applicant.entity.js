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
exports.ApplicantProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../shared/user.entity");
const gender_enum_1 = require("../../common/enums/gender.enum");
let ApplicantProfile = class ApplicantProfile {
    userId;
    user;
    firstName;
    lastName;
    gender;
    dob;
    bio;
    country;
    state;
    city;
    photoUrl;
    portfolioUrl;
    skills;
    experienceLevel;
    preferredEmploymentType;
    allowAiTraining;
    allowProfileIndexing;
    allowDataAnalytics;
    allowThirdPartySharing;
    privacyUpdatedAt;
    createdAt;
    updatedAt;
};
exports.ApplicantProfile = ApplicantProfile;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.applicantProfile, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ApplicantProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: gender_enum_1.Gender,
        nullable: true,
        comment: 'Gender identity of the applicant.',
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'Date of birth.' }),
    __metadata("design:type", Date)
], ApplicantProfile.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        comment: 'A short, professional biography of the applicant.',
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        name: 'photo_url',
        nullable: true,
        comment: 'URL to the applicant profile photo.',
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        name: 'portfolio_url',
        nullable: true,
        comment: 'URL to an external portfolio (e.g., Behance, GitHub).',
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "portfolioUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], ApplicantProfile.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'experience_level',
        type: 'enum',
        enum: ['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'],
        nullable: true
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "experienceLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'preferred_employment_type',
        type: 'enum',
        enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'VOLUNTEER', 'INTERNSHIP'],
        nullable: true
    }),
    __metadata("design:type", String)
], ApplicantProfile.prototype, "preferredEmploymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allow_ai_training',
        type: 'boolean',
        default: true,
        comment: 'Whether the applicant allows their data to be used for AI model training'
    }),
    __metadata("design:type", Boolean)
], ApplicantProfile.prototype, "allowAiTraining", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allow_profile_indexing',
        type: 'boolean',
        default: true,
        comment: 'Whether the applicant profile can be indexed and shown in search results'
    }),
    __metadata("design:type", Boolean)
], ApplicantProfile.prototype, "allowProfileIndexing", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allow_data_analytics',
        type: 'boolean',
        default: true,
        comment: 'Whether the applicant allows their data to be used for analytics and insights'
    }),
    __metadata("design:type", Boolean)
], ApplicantProfile.prototype, "allowDataAnalytics", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allow_third_party_sharing',
        type: 'boolean',
        default: false,
        comment: 'Whether the applicant allows their data to be shared with third-party partners'
    }),
    __metadata("design:type", Boolean)
], ApplicantProfile.prototype, "allowThirdPartySharing", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'privacy_updated_at',
        type: 'timestamptz',
        nullable: true,
        comment: 'Timestamp of the last privacy settings update'
    }),
    __metadata("design:type", Date)
], ApplicantProfile.prototype, "privacyUpdatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ApplicantProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ApplicantProfile.prototype, "updatedAt", void 0);
exports.ApplicantProfile = ApplicantProfile = __decorate([
    (0, typeorm_1.Entity)('applicant_profiles')
], ApplicantProfile);
//# sourceMappingURL=applicant.entity.js.map