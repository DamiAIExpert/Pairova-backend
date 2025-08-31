// src/users/nonprofit/nonprofit.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NonprofitOrg } from './nonprofit.entity';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { User } from '../shared/user.entity';

/**
 * @class NonprofitService
 * @description Handles business logic for managing non-profit organization profiles.
 */
@Injectable()
export class NonprofitService {
  constructor(
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitRepository: Repository<NonprofitOrg>,
  ) {}

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
    const profile = await this.getProfile(user);
    this.nonprofitRepository.merge(profile, updateDto);
    return this.nonprofitRepository.save(profile);
  }
}
