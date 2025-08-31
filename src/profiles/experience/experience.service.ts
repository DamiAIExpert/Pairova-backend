// src/profiles/experience/experience.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class ExperienceService
 * @description Handles business logic for user work experience.
 */
@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  /**
   * Adds a work experience entry to a user's profile.
   * @param user - The authenticated user.
   * @param createExperienceDto - The experience data.
   * @returns {Promise<Experience>} The newly created experience entity.
   */
  async addExperience(user: User, createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const experience = this.experienceRepository.create({
      ...createExperienceDto,
      userId: user.id,
    });
    return this.experienceRepository.save(experience);
  }

  /**
   * Finds all work experience entries for a specific user.
   * @param userId - The ID of the user.
   * @returns {Promise<Experience[]>} A list of the user's experience entries.
   */
  async findByUserId(userId: string): Promise<Experience[]> {
    return this.experienceRepository.find({ where: { userId } });
  }
}
