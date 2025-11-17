// src/profiles/education/education.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class EducationService
 * @description Handles business logic for user education profiles.
 */
@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  /**
   * Adds an education entry to a user's profile.
   * @param user - The authenticated user.
   * @param createEducationDto - The education data.
   * @returns {Promise<Education>} The newly created education entity.
   */
  async addEducation(user: User, createEducationDto: CreateEducationDto): Promise<Education> {
    const education = this.educationRepository.create({
      ...createEducationDto,
      userId: user.id,
      applicantId: user.id,
    });
    return this.educationRepository.save(education);
  }

  /**
   * Finds all education entries for a specific user.
   * @param userId - The ID of the user.
   * @returns {Promise<Education[]>} A list of the user's education entries.
   */
  async findByUserId(userId: string): Promise<Education[]> {
    return this.educationRepository.find({ where: { userId } });
  }

  /**
   * Finds a single education entry by its ID.
   * @param id - The UUID of the education entry.
   * @returns {Promise<Education>} The education entity.
   * @throws {NotFoundException} If the education entry is not found.
   */
  async findOneById(id: string): Promise<Education> {
    const education = await this.educationRepository.findOne({ where: { id } });
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
    return education;
  }

  /**
   * Deletes an education entry by its ID.
   * @param id - The UUID of the education entry to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the education entry to delete is not found.
   */
  async remove(id: string): Promise<void> {
    const education = await this.findOneById(id);
    await this.educationRepository.remove(education);
  }
}
