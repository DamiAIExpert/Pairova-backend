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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const policy_entity_1 = require("./entities/policy.entity");
let TermsService = class TermsService {
    policyRepository;
    constructor(policyRepository) {
        this.policyRepository = policyRepository;
    }
    async getPolicy(type) {
        const policy = await this.policyRepository.findOne({
            where: { type },
            order: { createdAt: 'DESC' },
        });
        if (!policy) {
            return this.policyRepository.save({
                type,
                version: '1.0.0',
                content: { blocks: [] },
                effectiveAt: new Date(),
                publishedBy: 'system',
            });
        }
        return policy;
    }
    async updatePolicy(type, dto, admin) {
        const policy = await this.getPolicy(type);
        const updatedPolicy = this.policyRepository.merge(policy, {
            ...dto,
            publishedBy: admin.id,
        });
        return this.policyRepository.save(updatedPolicy);
    }
};
exports.TermsService = TermsService;
exports.TermsService = TermsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(policy_entity_1.Policy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TermsService);
//# sourceMappingURL=terms.service.js.map