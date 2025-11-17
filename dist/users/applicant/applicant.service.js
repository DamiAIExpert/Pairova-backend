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
var ApplicantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const applicant_entity_1 = require("./applicant.entity");
const user_entity_1 = require("../shared/user.entity");
let ApplicantService = ApplicantService_1 = class ApplicantService {
    applicantProfileRepository;
    userRepository;
    logger = new common_1.Logger(ApplicantService_1.name);
    constructor(applicantProfileRepository, userRepository) {
        this.applicantProfileRepository = applicantProfileRepository;
        this.userRepository = userRepository;
    }
    async createProfile(userId) {
        const profile = this.applicantProfileRepository.create({
            userId,
            allowAiTraining: true,
            allowProfileIndexing: true,
            allowDataAnalytics: true,
            allowThirdPartySharing: false,
            allowPersonalInformation: true,
            allowGenderData: true,
            allowLocation: true,
            allowExperience: true,
            allowSkills: true,
            allowCertificates: true,
            allowBio: true,
        });
        return this.applicantProfileRepository.save(profile);
    }
    async getProfile(user) {
        const profile = await this.applicantProfileRepository.findOne({ where: { userId: user.id } });
        if (!profile) {
            throw new common_1.NotFoundException(`Applicant profile not found for user ID "${user.id}".`);
        }
        return profile;
    }
    async updateProfile(user, updateDto) {
        const profile = await this.getProfile(user);
        const { phone, ...profileData } = updateDto;
        if (phone !== undefined) {
            const userEntity = await this.userRepository.findOne({ where: { id: user.id } });
            if (userEntity) {
                userEntity.phone = phone;
                await this.userRepository.save(userEntity);
            }
        }
        this.applicantProfileRepository.merge(profile, profileData);
        return this.applicantProfileRepository.save(profile);
    }
    async getPrivacySettings(user) {
        const profile = await this.getProfile(user);
        return {
            userId: profile.userId,
            allowAiTraining: profile.allowAiTraining ?? true,
            allowProfileIndexing: profile.allowProfileIndexing ?? true,
            allowDataAnalytics: profile.allowDataAnalytics ?? true,
            allowThirdPartySharing: profile.allowThirdPartySharing ?? false,
            privacyUpdatedAt: profile.privacyUpdatedAt || null,
            allowPersonalInformation: profile.allowPersonalInformation ?? true,
            allowGenderData: profile.allowGenderData ?? true,
            allowLocation: profile.allowLocation ?? true,
            allowExperience: profile.allowExperience ?? true,
            allowSkills: profile.allowSkills ?? true,
            allowCertificates: profile.allowCertificates ?? true,
            allowBio: profile.allowBio ?? true,
        };
    }
    async updatePrivacySettings(user, updateDto) {
        const profile = await this.getProfile(user);
        this.logger.log(`Privacy settings updated for user ${user.id}`, {
            userId: user.id,
            changes: updateDto,
            timestamp: new Date().toISOString(),
        });
        if (updateDto.allowAiTraining !== undefined) {
            profile.allowAiTraining = updateDto.allowAiTraining;
        }
        if (updateDto.allowProfileIndexing !== undefined) {
            profile.allowProfileIndexing = updateDto.allowProfileIndexing;
        }
        if (updateDto.allowDataAnalytics !== undefined) {
            profile.allowDataAnalytics = updateDto.allowDataAnalytics;
        }
        if (updateDto.allowThirdPartySharing !== undefined) {
            profile.allowThirdPartySharing = updateDto.allowThirdPartySharing;
        }
        if (updateDto.allowPersonalInformation !== undefined) {
            profile.allowPersonalInformation = updateDto.allowPersonalInformation;
        }
        if (updateDto.allowGenderData !== undefined) {
            profile.allowGenderData = updateDto.allowGenderData;
        }
        if (updateDto.allowLocation !== undefined) {
            profile.allowLocation = updateDto.allowLocation;
        }
        if (updateDto.allowExperience !== undefined) {
            profile.allowExperience = updateDto.allowExperience;
        }
        if (updateDto.allowSkills !== undefined) {
            profile.allowSkills = updateDto.allowSkills;
        }
        if (updateDto.allowCertificates !== undefined) {
            profile.allowCertificates = updateDto.allowCertificates;
        }
        if (updateDto.allowBio !== undefined) {
            profile.allowBio = updateDto.allowBio;
        }
        const hasGranularCategories = updateDto.allowPersonalInformation !== undefined ||
            updateDto.allowGenderData !== undefined ||
            updateDto.allowLocation !== undefined ||
            updateDto.allowExperience !== undefined ||
            updateDto.allowSkills !== undefined ||
            updateDto.allowCertificates !== undefined ||
            updateDto.allowBio !== undefined;
        if (hasGranularCategories) {
            const anyCategoryEnabled = (updateDto.allowPersonalInformation ?? profile.allowPersonalInformation ?? true) ||
                (updateDto.allowGenderData ?? profile.allowGenderData ?? true) ||
                (updateDto.allowLocation ?? profile.allowLocation ?? true) ||
                (updateDto.allowExperience ?? profile.allowExperience ?? true) ||
                (updateDto.allowSkills ?? profile.allowSkills ?? true) ||
                (updateDto.allowCertificates ?? profile.allowCertificates ?? true) ||
                (updateDto.allowBio ?? profile.allowBio ?? true);
            if (updateDto.allowAiTraining === undefined) {
                profile.allowAiTraining = anyCategoryEnabled;
            }
            if (updateDto.allowProfileIndexing === undefined) {
                profile.allowProfileIndexing = anyCategoryEnabled;
            }
            if (updateDto.allowDataAnalytics === undefined) {
                profile.allowDataAnalytics = anyCategoryEnabled;
            }
        }
        profile.privacyUpdatedAt = new Date();
        await this.applicantProfileRepository.save(profile);
        return {
            userId: profile.userId,
            allowAiTraining: profile.allowAiTraining,
            allowProfileIndexing: profile.allowProfileIndexing,
            allowDataAnalytics: profile.allowDataAnalytics,
            allowThirdPartySharing: profile.allowThirdPartySharing,
            privacyUpdatedAt: profile.privacyUpdatedAt,
            allowPersonalInformation: profile.allowPersonalInformation ?? true,
            allowGenderData: profile.allowGenderData ?? true,
            allowLocation: profile.allowLocation ?? true,
            allowExperience: profile.allowExperience ?? true,
            allowSkills: profile.allowSkills ?? true,
            allowCertificates: profile.allowCertificates ?? true,
            allowBio: profile.allowBio ?? true,
        };
    }
    async allowsAiTraining(userId) {
        const profile = await this.applicantProfileRepository.findOne({
            where: { userId },
            select: ['userId', 'allowAiTraining']
        });
        return profile?.allowAiTraining ?? true;
    }
    async allowsProfileIndexing(userId) {
        const profile = await this.applicantProfileRepository.findOne({
            where: { userId },
            select: ['userId', 'allowProfileIndexing']
        });
        return profile?.allowProfileIndexing ?? true;
    }
    async allowsDataAnalytics(userId) {
        const profile = await this.applicantProfileRepository.findOne({
            where: { userId },
            select: ['userId', 'allowDataAnalytics']
        });
        return profile?.allowDataAnalytics ?? true;
    }
};
exports.ApplicantService = ApplicantService;
exports.ApplicantService = ApplicantService = ApplicantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ApplicantService);
//# sourceMappingURL=applicant.service.js.map