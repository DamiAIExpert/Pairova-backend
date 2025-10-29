// src/users/nonprofit/nonprofit.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NonprofitOrg } from './nonprofit.entity';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { User } from '../shared/user.entity';

/**
 * @class NonprofitService
 * @description Handles business logic for managing non-profit organization profiles.
 */
@Injectable()
export class NonprofitService {
  private readonly logger = new Logger(NonprofitService.name);

  constructor(
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
  ) {}

  /**
   * Creates an empty profile for a new nonprofit user.
   * @param userId - The user's ID.
   * @param orgName - The organization name (required field).
   * @returns {Promise<NonprofitOrg>} The newly created nonprofit profile.
   */
  async createProfile(userId: string, orgName: string): Promise<NonprofitOrg> {
    const profile = this.nonprofitRepository.create({ userId, orgName });
    return this.nonprofitRepository.save(profile);
  }

  /**
   * Retrieves the profile for a given non-profit user.
   * @param user - The authenticated user entity.
   * @returns {Promise<NonprofitOrg>} The user's organization profile.
   * @throws {NotFoundException} If the user does not have a non-profit profile.
   */
  async getProfile(user: User): Promise<NonprofitOrg> {
    const profile = await this.nonprofitRepository.findOne({ where: { userId: user.id } });
    if (!profile) {
      throw new NotFoundException(`Non-profit profile not found for user ID "${user.id}".`);
    }
    return profile;
  }

  /**
   * Updates a non-profit's profile.
   * @param user - The authenticated user entity.
   * @param updateDto - The DTO containing the fields to update.
   * @returns {Promise<NonprofitOrg>} The updated organization profile.
   */
  async updateProfile(user: User, updateDto: UpdateNonprofitProfileDto): Promise<NonprofitOrg> {
    this.logger.log(`Updating nonprofit profile for user ID: ${user.id}`);
    this.logger.log(`Update data: ${JSON.stringify(updateDto)}`);
    
    let profile: NonprofitOrg;
    
    try {
      this.logger.log(`Attempting to fetch existing profile...`);
      profile = await this.getProfile(user);
      this.logger.log(`Profile found: ${profile.userId}`);
    } catch (error) {
      // If profile doesn't exist, create it with a default org name
      if (error instanceof NotFoundException) {
        this.logger.warn(`Profile not found for user ${user.id}. Creating new profile...`);
        const defaultOrgName = updateDto.orgName || user.email.split('@')[0] || 'Organization';
        this.logger.log(`Creating profile with org name: ${defaultOrgName}`);
        profile = await this.createProfile(user.id, defaultOrgName);
        this.logger.log(`Profile created successfully with ID: ${profile.userId}`);
      } else {
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

  /**
   * Complete NGO onboarding - handles ALL data from all 7 steps at once
   * @param user - The authenticated user entity.
   * @param onboardingDto - Complete onboarding data from all 7 steps.
   * @returns {Promise<NonprofitOrg>} The complete organization profile.
   */
  async completeOnboarding(user: User, onboardingDto: CompleteOnboardingDto): Promise<NonprofitOrg> {
    this.logger.log(`🚀 Starting complete onboarding for user ID: ${user.id}`);
    this.logger.log(`📦 Onboarding data received: ${JSON.stringify(onboardingDto, null, 2)}`);
    
    let profile: NonprofitOrg;
    
    try {
      // Try to get existing profile
      this.logger.log(`🔍 Checking for existing profile...`);
      profile = await this.getProfile(user);
      this.logger.log(`✅ Found existing profile: ${profile.userId}`);
    } catch (error) {
      // If profile doesn't exist, create it
      if (error instanceof NotFoundException) {
        this.logger.warn(`⚠️  No existing profile found. Creating new profile...`);
        profile = await this.createProfile(user.id, onboardingDto.orgName);
        this.logger.log(`✅ New profile created with ID: ${profile.userId}`);
      } else {
        this.logger.error(`❌ Unexpected error getting profile: ${error.message}`);
        throw error;
      }
    }
    
    // Map all onboarding data to the profile entity
    this.logger.log(`📝 Mapping complete onboarding data to profile...`);
    
    const updateData: Partial<NonprofitOrg> = {
      // Step 1: Account Info
      orgName: onboardingDto.orgName,
      country: onboardingDto.country,
      // logoUrl: onboardingDto.logoUrl, // Will be set after file upload is implemented
      
      // Step 2: Company Information
      phone: onboardingDto.phone,
      foundedOn: onboardingDto.foundedOn ? new Date(onboardingDto.foundedOn) : null,
      orgType: onboardingDto.orgType,
      industry: onboardingDto.industry,
      sizeLabel: onboardingDto.sizeLabel,
      website: onboardingDto.website,
      registrationNumber: onboardingDto.registrationNumber,
      
      // Step 3: Address
      state: onboardingDto.state,
      city: onboardingDto.city,
      addressLine1: onboardingDto.addressLine1,
      addressLine2: onboardingDto.addressLine2,
      postalCode: onboardingDto.postalCode,
      
      // Step 4: Bio
      bio: onboardingDto.bio,
      
      // Step 5: Mission Statement
      missionStatement: onboardingDto.missionStatement,
      
      // Step 6: Our Values
      values: onboardingDto.values,
      
      // Step 7: Skills
      requiredSkills: onboardingDto.requiredSkills,
      
      // Optional fields
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
}
