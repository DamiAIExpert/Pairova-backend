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
exports.NonprofitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nonprofit_entity_1 = require("./nonprofit.entity");
let NonprofitService = class NonprofitService {
    nonprofitRepository;
    constructor(nonprofitRepository) {
        this.nonprofitRepository = nonprofitRepository;
    }
    async getProfile(user) {
        const profile = await this.nonprofitRepository.findOne({ where: { userId: user.id } });
        if (!profile) {
            throw new common_1.NotFoundException(`Non-profit profile not found for user ID "${user.id}".`);
        }
        return profile;
    }
    async updateProfile(user, updateDto) {
        const profile = await this.getProfile(user);
        this.nonprofitRepository.merge(profile, updateDto);
        return this.nonprofitRepository.save(profile);
    }
};
exports.NonprofitService = NonprofitService;
exports.NonprofitService = NonprofitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NonprofitService);
//# sourceMappingURL=nonprofit.service.js.map