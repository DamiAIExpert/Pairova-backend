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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findOneByIdWithProfile(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['applicantProfile', 'nonprofitOrg'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found.`);
        }
        return user;
    }
    async findOneById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async findByEmailWithPassword(email) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.passwordHash')
            .getOne();
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async create(userDto) {
        const newUser = this.usersRepository.create(userDto);
        return this.usersRepository.save(newUser);
    }
    async updatePassword(userId, passwordHash) {
        const result = await this.usersRepository.update({ id: userId }, { passwordHash });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
    async markOnboardingComplete(userId) {
        const result = await this.usersRepository.update({ id: userId }, { hasCompletedOnboarding: true });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
    async all() {
        return this.usersRepository.find();
    }
    async deleteAccount(userId) {
        const result = await this.usersRepository.delete({ id: userId });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
    async findByEmailVerificationToken(token) {
        return this.usersRepository.findOne({ where: { emailVerificationToken: token } });
    }
    async markEmailAsVerified(userId) {
        const result = await this.usersRepository.update({ id: userId }, { isVerified: true, emailVerificationToken: null });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
    async findByOAuthProvider(provider, oauthId) {
        return this.usersRepository.findOne({
            where: { oauthProvider: provider, oauthId },
        });
    }
    async linkOAuthAccount(userId, oauthData) {
        const result = await this.usersRepository.update({ id: userId }, {
            oauthProvider: oauthData.oauthProvider,
            oauthId: oauthData.oauthId,
            oauthProfile: oauthData.oauthProfile,
            isVerified: true,
        });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
    async update(userId, updateData) {
        const result = await this.usersRepository.update({ id: userId }, updateData);
        if (!result.affected) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found.`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=user.service.js.map