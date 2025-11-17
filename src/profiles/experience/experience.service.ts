// src/profiles/experience/experience.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
      applicantId: user.id,
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

  /**
   * Finds a single experience entry by its ID.
   * @param id - The UUID of the experience entry.
   * @returns {Promise<Experience>} The experience entity.
   * @throws {NotFoundException} If the experience entry is not found.
   */
  async findOneById(id: string): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({ where: { id } });
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  /**
   * Deletes an experience entry by its ID.
   * @param id - The UUID of the experience entry to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the experience entry to delete is not found.
   */
  async remove(id: string): Promise<void> {
    const experience = await this.findOneById(id);
    await this.experienceRepository.remove(experience);
  }
}
