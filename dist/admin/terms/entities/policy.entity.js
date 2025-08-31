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
exports.Policy = void 0;
const typeorm_1 = require("typeorm");
const policy_type_enum_1 = require("../../../common/enums/policy-type.enum");
let Policy = class Policy {
    id;
    type;
    version;
    content;
    effectiveAt;
    publishedBy;
    createdAt;
};
exports.Policy = Policy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Policy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: policy_type_enum_1.PolicyType, unique: true }),
    __metadata("design:type", String)
], Policy.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], Policy.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { comment: 'The rich content of the policy document' }),
    __metadata("design:type", Object)
], Policy.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Policy.prototype, "effectiveAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_by', type: 'uuid' }),
    __metadata("design:type", String)
], Policy.prototype, "publishedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Policy.prototype, "createdAt", void 0);
exports.Policy = Policy = __decorate([
    (0, typeorm_1.Entity)('policies')
], Policy);
//# sourceMappingURL=policy.entity.js.map