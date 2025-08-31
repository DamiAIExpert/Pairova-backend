// src/auth/otp/otp.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // ✅ Updated to bcryptjs

import { Otp } from './otp.entity';
import { OtpChannel } from '../../common/enums/otp-channel.enum';
import { User } from '../../users/shared/user.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  private generateNumericCode(length = 6): string {
    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  }

  /**
   * Create and store an OTP for a user.
   * Returns { id, code } where `code` is plaintext to deliver to the user.
   */
  async generateOtp(
    user: User | string,
    channel: OtpChannel,
    ttlMinutes = 15,
  ): Promise<{ id: string; code: string }> {
    const userId = typeof user === 'string' ? user : user.id;

    const code = this.generateNumericCode(6);
    const codeHash = await bcrypt.hash(code, 10);

    const record = this.otpRepo.create({
      userId,
      channel,
      codeHash,
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
      consumedAt: null,
    });

    const saved = await this.otpRepo.save(record);
    return { id: saved.id, code };
  }

  /**
   * Validate an OTP for a user (and optional channel).
   * Returns the OTP record if valid; otherwise null.
   */
  async validateOtp(
    userId: string,
    token: string,
    channel?: OtpChannel,
  ): Promise<Otp | null> {
    const where: any = {
      userId,
      consumedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    };
    if (channel) where.channel = channel;

    const otp = await this.otpRepo.findOne({ where });
    if (!otp) return null;

    const ok = await bcrypt.compare(token, otp.codeHash);
    return ok ? otp : null;
  }

  /**
   * Mark an OTP as consumed (by id).
   */
  async consumeOtp(id: string): Promise<void> {
    await this.otpRepo.update({ id }, { consumedAt: new Date() });
  }
}
