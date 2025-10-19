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
exports.NonprofitOrg = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../shared/user.entity");
let NonprofitOrg = class NonprofitOrg {
    userId;
    user;
    orgName;
    logoUrl;
    website;
    mission;
    values;
    sizeLabel;
    orgType;
    industry;
    foundedOn;
    taxId;
    country;
    state;
    city;
    addressLine1;
    addressLine2;
    latitude;
    longitude;
    createdAt;
    updatedAt;
};
exports.NonprofitOrg = NonprofitOrg;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.nonprofitOrg, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], NonprofitOrg.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_name', length: 255 }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "orgName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'logo_url', nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true, comment: 'The mission statement of the organization.' }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "mission", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true, comment: 'The core values of the organization.' }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "values", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_label', length: 64, nullable: true, comment: 'e.g., "10-50 employees"' }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "sizeLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_type', length: 64, nullable: true, comment: 'e.g., "Private Company", "Charity"' }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "orgType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'founded_on', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], NonprofitOrg.prototype, "foundedOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 128, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], NonprofitOrg.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], NonprofitOrg.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], NonprofitOrg.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NonprofitOrg.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], NonprofitOrg.prototype, "updatedAt", void 0);
exports.NonprofitOrg = NonprofitOrg = __decorate([
    (0, typeorm_1.Entity)('nonprofit_orgs')
], NonprofitOrg);
//# sourceMappingURL=nonprofit.entity.js.map