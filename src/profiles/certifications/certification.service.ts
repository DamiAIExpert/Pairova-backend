// src/profiles/certifications/certification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class CertificationService
 * @description Handles the business logic for creating, retrieving, and deleting user certifications.
 */
@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
  ) {}

  /**
   * Adds a new certification to a user's profile.
   * @param user - The authenticated user.
   * @param createCertificationDto - The DTO containing the certification details.
   * @returns {Promise<Certification>} The newly created certification record.
   */
  async add(user: User, createCertificationDto: CreateCertificationDto): Promise<Certification> {
    const newCertification = this.certificationRepository.create({
      ...createCertificationDto,
      userId: user.id,
    });
    return this.certificationRepository.save(newCertification);
  }

  /**
   * Retrieves all certifications for a specific user.
   * @param userId - The ID of the user whose certifications are to be retrieved.
   * @returns {Promise<Certification[]>} A list of the user's certifications, ordered by issue date descending.
   */
  async findAllByUserId(userId: string): Promise<Certification[]> {
    return this.certificationRepository.find({ where: { userId }, order: { issueDate: 'DESC' } });
  }

  /**
   * Finds a single certification record by its ID.
   * This is useful for authorization checks before performing an update or delete.
   * @param id - The UUID of the certification.
   * @returns {Promise<Certification>} The certification entity.
   * @throws {NotFoundException} If no certification is found with the given ID.
   */
  async findOneById(id: string): Promise<Certification> {
      const certification = await this.certificationRepository.findOne({ where: { id } });
      if (!certification) {
          throw new NotFoundException(`Certification with ID "${id}" not found.`);
      }
      return certification;
  }

  /**
   * Deletes a certification record by its ID.
   * @param id - The UUID of the certification to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the certification to delete is not found.
   */
  async remove(id: string): Promise<void> {
    const result = await this.certificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Certification with ID "${id}" not found.`);
    }
  }
}

