// src/users/shared/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

/**
 * @class UsersService
 * @description Business logic for managing users (CRUD + lookups used by auth).
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by ID and eagerly loads role-specific profiles.
   * Used by JwtStrategy (and WebSocket guards) to hydrate request.user.
   */
  async findOneByIdWithProfile(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['applicantProfile', 'nonprofitOrg'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  /**
   * Finds a user by ID (no relations).
   */
  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Finds a user by email and includes passwordHash (column has select:false).
   * Used by LocalStrategy and AuthService credential validation.
   */
  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .getOne();
  }

  /**
   * Finds a user by email (without password).
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Creates a new user. (Extend with DTOs/validation as needed.)
   * If you create role-specific profiles, hook that logic in here.
   */
  async create(userDto: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userDto);
    return this.usersRepository.save(newUser);
  }

  /**
   * Updates a user's password hash.
   */
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    const result: UpdateResult = await this.usersRepository.update(
      { id: userId },
      { passwordHash },
    );
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }

  /**
   * Marks the user's onboarding as completed.
   * This ensures the onboarding flow only shows once after initial signup.
   */
  async markOnboardingComplete(userId: string): Promise<void> {
    const result: UpdateResult = await this.usersRepository.update(
      { id: userId },
      { hasCompletedOnboarding: true },
    );
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }

  /**
   * Returns all users. (Consider pagination for production use.)
   */
  async all(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Deletes a user account and all associated data.
   * Due to CASCADE relationships, this will also delete:
   * - ApplicantProfile or NonprofitOrg
   * - All related data (education, experience, certifications, etc.)
   */
  async deleteAccount(userId: string): Promise<void> {
    const result = await this.usersRepository.delete({ id: userId });
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }

  /**
   * Finds a user by email verification token.
   */
  async findByEmailVerificationToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { emailVerificationToken: token } });
  }

  /**
   * Marks a user's email as verified.
   */
  async markEmailAsVerified(userId: string): Promise<void> {
    const result: UpdateResult = await this.usersRepository.update(
      { id: userId },
      { isVerified: true, emailVerificationToken: null },
    );
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }

  /**
   * Finds a user by OAuth provider and OAuth ID.
   */
  async findByOAuthProvider(provider: string, oauthId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { oauthProvider: provider, oauthId },
    });
  }

  /**
   * Links an OAuth account to an existing user.
   */
  async linkOAuthAccount(
    userId: string,
    oauthData: { oauthProvider: string; oauthId: string; oauthProfile?: any },
  ): Promise<void> {
    const result: UpdateResult = await this.usersRepository.update(
      { id: userId },
      {
        oauthProvider: oauthData.oauthProvider,
        oauthId: oauthData.oauthId,
        oauthProfile: oauthData.oauthProfile,
        isVerified: true, // OAuth accounts are pre-verified
      },
    );
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }

  /**
   * Updates a user's data.
   */
  async update(userId: string, updateData: Partial<User>): Promise<void> {
    const result: UpdateResult = await this.usersRepository.update(
      { id: userId },
      updateData,
    );
    if (!result.affected) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  }
}
