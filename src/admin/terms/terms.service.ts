// src/admin/terms/terms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { PolicyType } from '../../common/enums/policy-type.enum';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class TermsService
 * @description Handles the business logic for managing legal policy documents.
 */
@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
  ) {}

  /**
   * Retrieves the latest version of a specific policy type.
   * @param type - The type of the policy to retrieve (TERMS or PRIVACY).
   * @returns {Promise<Policy>} The found policy document.
   */
  async getPolicy(type: PolicyType): Promise<Policy> {
    const policy = await this.policyRepository.findOne({
      where: { type },
      order: { createdAt: 'DESC' }, // Get the most recent one
    });

    if (!policy) {
      // Create a default if it doesn't exist
      return this.policyRepository.save({
        type,
        version: '1.0.0',
        content: { blocks: [] },
        effectiveAt: new Date(),
        publishedBy: 'system', // Indicates a default record
      });
    }
    return policy;
  }

  /**
   * Updates a policy document. In a real-world scenario, this would create a new version
   * rather than updating in place to preserve history.
   * @param type - The type of policy to update.
   * @param dto - The DTO with the updated content.
   * @param admin - The admin user performing the update.
   * @returns {Promise<Policy>} The updated policy document.
   */
  async updatePolicy(type: PolicyType, dto: UpdatePolicyDto, admin: User): Promise<Policy> {
    const policy = await this.getPolicy(type); // Ensures a policy exists
    const updatedPolicy = this.policyRepository.merge(policy, {
      ...dto,
      publishedBy: admin.id,
    });
    return this.policyRepository.save(updatedPolicy);
  }
}
