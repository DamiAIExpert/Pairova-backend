// src/profiles/education/education.service.ts
import { Injectable } from '@nestjs/common';
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
}
