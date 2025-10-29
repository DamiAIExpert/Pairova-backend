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
var NonprofitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonprofitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nonprofit_entity_1 = require("./nonprofit.entity");
let NonprofitService = NonprofitService_1 = class NonprofitService {
    nonprofitRepository;
    logger = new common_1.Logger(NonprofitService_1.name);
    constructor(nonprofitRepository) {
        this.nonprofitRepository = nonprofitRepository;
    }
    async createProfile(userId, orgName) {
        const profile = this.nonprofitRepository.create({ userId, orgName });
        return this.nonprofitRepository.save(profile);
    }
    async getProfile(user) {
        const profile = await this.nonprofitRepository.findOne({ where: { userId: user.id } });
        if (!profile) {
            throw new common_1.NotFoundException(`Non-profit profile not found for user ID "${user.id}".`);
        }
        return profile;
    }
    async updateProfile(user, updateDto) {
        this.logger.log(`Updating nonprofit profile for user ID: ${user.id}`);
        this.logger.log(`Update data: ${JSON.stringify(updateDto)}`);
        let profile;
        try {
            this.logger.log(`Attempting to fetch existing profile...`);
            profile = await this.getProfile(user);
            this.logger.log(`Profile found: ${profile.userId}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.warn(`Profile not found for user ${user.id}. Creating new profile...`);
                const defaultOrgName = updateDto.orgName || user.email.split('@')[0] || 'Organization';
                this.logger.log(`Creating profile with org name: ${defaultOrgName}`);
                profile = await this.createProfile(user.id, defaultOrgName);
                this.logger.log(`Profile created successfully with ID: ${profile.userId}`);
            }
            else {
                this.logger.error(`Unexpected error getting profile: ${error.message}`);
                throw error;
            }
        }
        this.logger.log(`Merging update data into profile...`);
        this.nonprofitRepository.merge(profile, updateDto);
        this.logger.log(`Saving updated profile...`);
        const savedProfile = await this.nonprofitRepository.save(profile);
        this.logger.log(`Profile saved successfully!`);
        return savedProfile;
    }
    async completeOnboarding(user, onboardingDto) {
        this.logger.log(`🚀 Starting complete onboarding for user ID: ${user.id}`);
        this.logger.log(`📦 Onboarding data received: ${JSON.stringify(onboardingDto, null, 2)}`);
        let profile;
        try {
            this.logger.log(`🔍 Checking for existing profile...`);
            profile = await this.getProfile(user);
            this.logger.log(`✅ Found existing profile: ${profile.userId}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.warn(`⚠️  No existing profile found. Creating new profile...`);
                profile = await this.createProfile(user.id, onboardingDto.orgName);
                this.logger.log(`✅ New profile created with ID: ${profile.userId}`);
            }
            else {
                this.logger.error(`❌ Unexpected error getting profile: ${error.message}`);
                throw error;
            }
        }
        this.logger.log(`📝 Mapping complete onboarding data to profile...`);
        const updateData = {
            orgName: onboardingDto.orgName,
            country: onboardingDto.country,
            phone: onboardingDto.phone,
            foundedOn: onboardingDto.foundedOn ? new Date(onboardingDto.foundedOn) : null,
            orgType: onboardingDto.orgType,
            industry: onboardingDto.industry,
            sizeLabel: onboardingDto.sizeLabel,
            website: onboardingDto.website,
            registrationNumber: onboardingDto.registrationNumber,
            state: onboardingDto.state,
            city: onboardingDto.city,
            addressLine1: onboardingDto.addressLine1,
            addressLine2: onboardingDto.addressLine2,
            postalCode: onboardingDto.postalCode,
            bio: onboardingDto.bio,
            missionStatement: onboardingDto.missionStatement,
            values: onboardingDto.values,
            requiredSkills: onboardingDto.requiredSkills,
            firstName: onboardingDto.firstName,
            lastName: onboardingDto.lastName,
            position: onboardingDto.position,
            socialMediaLinks: onboardingDto.socialMediaLinks,
        };
        this.logger.log(`🔄 Merging data into profile...`);
        this.nonprofitRepository.merge(profile, updateData);
        this.logger.log(`💾 Saving complete profile to database...`);
        const savedProfile = await this.nonprofitRepository.save(profile);
        this.logger.log(`🎉 Onboarding completed successfully!`);
        this.logger.log(`📊 Final profile: ${JSON.stringify(savedProfile, null, 2)}`);
        return savedProfile;
    }
};
exports.NonprofitService = NonprofitService;
exports.NonprofitService = NonprofitService = NonprofitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NonprofitService);
//# sourceMappingURL=nonprofit.service.js.map