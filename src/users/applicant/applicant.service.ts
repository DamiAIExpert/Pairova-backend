// src/users/applicant/applicant.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicantProfile } from './applicant.entity';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { UpdatePrivacySettingsDto } from './dto/update-privacy-settings.dto';
import { PrivacySettingsResponseDto } from './dto/privacy-settings-response.dto';
import { User } from '../shared/user.entity';

/**
 * @class ApplicantService
 * @description Handles business logic for managing applicant profiles.
 */
@Injectable()
export class ApplicantService {
  private readonly logger = new Logger(ApplicantService.name);

  constructor(
    @InjectRepository(ApplicantProfile)
    private readonly applicantProfileRepository: Repository<ApplicantProfile>,
  ) {}

  /**
   * Creates an empty profile for a new applicant user.
   * @param userId - The user's ID.
   * @returns {Promise<ApplicantProfile>} The newly created applicant profile.
   */
  async createProfile(userId: string): Promise<ApplicantProfile> {
    const profile = this.applicantProfileRepository.create({ 
      userId,
      // Set default privacy settings
      allowAiTraining: true,
      allowProfileIndexing: true,
      allowDataAnalytics: true,
      allowThirdPartySharing: false,
    });
    return this.applicantProfileRepository.save(profile);
  }

  /**
   * Retrieves the profile for a given applicant user.
   * @param user - The authenticated user entity.
   * @returns {Promise<ApplicantProfile>} The user's applicant profile.
   * @throws {NotFoundException} If the user does not have an applicant profile.
   */
  async getProfile(user: User): Promise<ApplicantProfile> {
    const profile = await this.applicantProfileRepository.findOne({ where: { userId: user.id } });
    if (!profile) {
      // This case should ideally not happen for a user with the APPLICANT role
      // after registration, but it's a good safeguard.
      throw new NotFoundException(`Applicant profile not found for user ID "${user.id}".`);
    }
    return profile;
  }

  /**
   * Updates an applicant's profile.
   * @param user - The authenticated user entity.
   * @param updateDto - The DTO containing the fields to update.
   * @returns {Promise<ApplicantProfile>} The updated applicant profile.
   */
  async updateProfile(user: User, updateDto: UpdateApplicantProfileDto): Promise<ApplicantProfile> {
    const profile = await this.getProfile(user);
    // Merge the existing profile with the new data from the DTO
    this.applicantProfileRepository.merge(profile, updateDto);
    return this.applicantProfileRepository.save(profile);
  }

  /**
   * Get privacy settings for an applicant
   * @param user - The authenticated user entity.
   * @returns {Promise<PrivacySettingsResponseDto>} The applicant's privacy settings.
   */
  async getPrivacySettings(user: User): Promise<PrivacySettingsResponseDto> {
    const profile = await this.getProfile(user);
    
    return {
      userId: profile.userId,
      allowAiTraining: profile.allowAiTraining ?? true,
      allowProfileIndexing: profile.allowProfileIndexing ?? true,
      allowDataAnalytics: profile.allowDataAnalytics ?? true,
      allowThirdPartySharing: profile.allowThirdPartySharing ?? false,
      privacyUpdatedAt: profile.privacyUpdatedAt || null,
    };
  }

  /**
   * Update privacy settings for an applicant
   * @param user - The authenticated user entity.
   * @param updateDto - The DTO containing the privacy settings to update.
   * @returns {Promise<PrivacySettingsResponseDto>} The updated privacy settings.
   */
  async updatePrivacySettings(
    user: User, 
    updateDto: UpdatePrivacySettingsDto
  ): Promise<PrivacySettingsResponseDto> {
    const profile = await this.getProfile(user);
    
    // Log privacy settings change for audit purposes
    this.logger.log(`Privacy settings updated for user ${user.id}`, {
      userId: user.id,
      changes: updateDto,
      timestamp: new Date().toISOString(),
    });

    // Update privacy settings
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

    // Update timestamp
    profile.privacyUpdatedAt = new Date();

    await this.applicantProfileRepository.save(profile);

    return {
      userId: profile.userId,
      allowAiTraining: profile.allowAiTraining,
      allowProfileIndexing: profile.allowProfileIndexing,
      allowDataAnalytics: profile.allowDataAnalytics,
      allowThirdPartySharing: profile.allowThirdPartySharing,
      privacyUpdatedAt: profile.privacyUpdatedAt,
    };
  }

  /**
   * Check if an applicant allows AI training
   * @param userId - The user's ID.
   * @returns {Promise<boolean>} Whether the applicant allows AI training.
   */
  async allowsAiTraining(userId: string): Promise<boolean> {
    const profile = await this.applicantProfileRepository.findOne({ 
      where: { userId },
      select: ['userId', 'allowAiTraining']
    });
    
    // Default to true if profile not found or setting not set
    return profile?.allowAiTraining ?? true;
  }

  /**
   * Check if an applicant allows profile indexing
   * @param userId - The user's ID.
   * @returns {Promise<boolean>} Whether the applicant allows profile indexing.
   */
  async allowsProfileIndexing(userId: string): Promise<boolean> {
    const profile = await this.applicantProfileRepository.findOne({ 
      where: { userId },
      select: ['userId', 'allowProfileIndexing']
    });
    
    // Default to true if profile not found or setting not set
    return profile?.allowProfileIndexing ?? true;
  }

  /**
   * Check if an applicant allows data analytics
   * @param userId - The user's ID.
   * @returns {Promise<boolean>} Whether the applicant allows data analytics.
   */
  async allowsDataAnalytics(userId: string): Promise<boolean> {
    const profile = await this.applicantProfileRepository.findOne({ 
      where: { userId },
      select: ['userId', 'allowDataAnalytics']
    });
    
    // Default to true if profile not found or setting not set
    return profile?.allowDataAnalytics ?? true;
  }
}
