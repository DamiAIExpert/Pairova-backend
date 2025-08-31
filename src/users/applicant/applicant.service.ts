// src/users/applicant/applicant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicantProfile } from './applicant.entity';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { User } from '../shared/user.entity';

/**
 * @class ApplicantService
 * @description Handles business logic for managing applicant profiles.
 */
@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(ApplicantProfile)
    private readonly applicantProfileRepository: Repository<ApplicantProfile>,
  ) {}

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
}
