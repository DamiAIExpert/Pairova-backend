// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs'; // ✅ Replaced bcrypt with bcryptjs

import { UsersService } from '../users/shared/user.service';
import { ApplicantService } from '../users/applicant/applicant.service';
import { NonprofitService } from '../users/nonprofit/nonprofit.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/shared/user.entity';
import { Role } from '../common/enums/role.enum';
import { OtpService } from './otp/otp.service';
import { OtpChannel } from '../common/enums/otp-channel.enum';
import { EmailService } from '../notifications/email.service';
import { UrlHelper } from '../common/utils/url.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly applicantService: ApplicantService,
    private readonly nonprofitService: NonprofitService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result as Omit<User, 'passwordHash'>;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Fetch user with profile data to include firstName and lastName
    const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
    
    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = userWithProfile;
    
    // Extract firstName and lastName from profile if available
    let firstName: string | undefined;
    let lastName: string | undefined;
    let orgName: string | undefined;
    
    if (userWithProfile.applicantProfile) {
      firstName = userWithProfile.applicantProfile.firstName;
      lastName = userWithProfile.applicantProfile.lastName;
    } else if (userWithProfile.nonprofitOrg) {
      orgName = userWithProfile.nonprofitOrg.orgName;
    }
    
    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        firstName,
        lastName,
        orgName,
      },
    };
  }

  async register(
    email: string,
    password: string,
    role: Role,
    fullName?: string,
    orgName?: string,
  ) {
    const existing = await this.usersService.findByEmailWithPassword(email);
    if (existing) throw new BadRequestException('Email already in use.');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, passwordHash, role });
    
    // Create profile based on role
    try {
      if (role === Role.APPLICANT && fullName) {
        // Parse fullName into firstName and lastName
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Create applicant profile with name
        await this.applicantService.createProfile(user.id);
        
        // Update profile with firstName and lastName if provided
        if (firstName) {
          const profile = await this.applicantService.getProfile(user);
          profile.firstName = firstName;
          profile.lastName = lastName;
          await this.applicantService.updateProfile(user, profile);
        }
      } else if (role === Role.NONPROFIT && orgName) {
        // Create nonprofit profile with organization name
        await this.nonprofitService.createProfile(user.id, orgName);
      } else {
        // Create empty profile if no name provided
        if (role === Role.APPLICANT) {
          await this.applicantService.createProfile(user.id);
        } else if (role === Role.NONPROFIT) {
          // Nonprofit requires orgName, use email as fallback
          const defaultOrgName = email.split('@')[0];
          await this.nonprofitService.createProfile(user.id, defaultOrgName);
        }
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      // Continue with registration even if profile creation fails
    }
    
    // Generate tokens for the new user
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Send verification email asynchronously (don't wait for it)
    this.otpService.generateOtp(user.id, OtpChannel.EMAIL)
      .then(({ code }) => {
        const displayName = fullName || orgName || email.split('@')[0];
        
        // Generate verification link dynamically based on environment
        const isAdmin = role === Role.ADMIN;
        const verificationLink = UrlHelper.generateVerificationLink(
          this.configService,
          email,
          code,
          isAdmin,
        );
        
        return this.emailService.sendFromTemplate(
          user.email,
          'Verify Your Email',
          'email-verification',
          { 
            code, 
            name: displayName,
            verificationLink,
          },
        );
      })
      .catch((error) => {
        // Log error but don't fail registration
        console.error('Failed to send verification email:', error);
      });
    
    // Fetch user with profile to return complete data
    const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
    const { passwordHash: _, ...userWithoutPassword } = userWithProfile;
    
    // Extract profile data for response
    let firstName: string | undefined;
    let lastName: string | undefined;
    let organizationName: string | undefined;
    
    if (userWithProfile.applicantProfile) {
      firstName = userWithProfile.applicantProfile.firstName;
      lastName = userWithProfile.applicantProfile.lastName;
    } else if (userWithProfile.nonprofitOrg) {
      organizationName = userWithProfile.nonprofitOrg.orgName;
    }
    
    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        firstName,
        lastName,
        orgName: organizationName,
      },
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return; // don't leak user existence

    const { code } = await this.otpService.generateOtp(user.id, OtpChannel.EMAIL);

    await this.emailService.sendFromTemplate(
      user.email,
      'Your Password Reset Code',
      'password-reset',
      { code, name: user.email },
    );
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) throw new BadRequestException('Invalid reset request.');

    const otpRecord = await this.otpService.validateOtp(user.id, token, OtpChannel.EMAIL);
    if (!otpRecord) throw new BadRequestException('Invalid or expired reset token.');

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, newPasswordHash);

    await this.otpService.consumeOtp(otpRecord.id);
  }

  async verifyUserFromToken(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token);
    const user = await this.usersService.findOneByIdWithProfile(payload.sub);
    if (!user) throw new UnauthorizedException('User not found.');
    return user;
  }

  async logout(): Promise<{ message: string }> {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // In a more sophisticated system, you might maintain a blacklist of tokens
    return { message: 'Logged out successfully' };
  }

  async verifyEmail(email: string, token: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate OTP
    const otpRecord = await this.otpService.validateOtp(user.id, token, OtpChannel.EMAIL);
    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Mark email as verified
    await this.usersService.markEmailAsVerified(user.id);
    
    // Consume the OTP so it can't be reused
    await this.otpService.consumeOtp(otpRecord.id);
    
    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const { code } = await this.otpService.generateOtp(user.id, OtpChannel.EMAIL);
    
    // Generate verification link dynamically based on user role
    const isAdmin = user.role === Role.ADMIN;
    const verificationLink = UrlHelper.generateVerificationLink(
      this.configService,
      email,
      code,
      isAdmin,
    );

    await this.emailService.sendFromTemplate(
      user.email,
      'Verify Your Email',
      'email-verification',
      { 
        code, 
        name: user.email,
        verificationLink,
      },
    );

    return { message: 'Verification email sent successfully' };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneByIdWithProfile(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const newPayload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
      return { accessToken: this.jwtService.sign(newPayload) };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async completeOnboarding(userId: string): Promise<{ message: string }> {
    await this.usersService.markOnboardingComplete(userId);
    return { message: 'Onboarding completed successfully' };
  }

  /**
   * Find or create a user from OAuth provider data
   * @param oauthData OAuth user data from provider
   * @returns User with tokens
   */
  async findOrCreateOAuthUser(oauthData: {
    oauthProvider: string;
    oauthId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    oauthProfile?: any;
  }) {
    // Try to find existing user by OAuth provider and ID
    let user = await this.usersService.findByOAuthProvider(
      oauthData.oauthProvider,
      oauthData.oauthId,
    );

    if (!user) {
      // Try to find by email (user might have registered with email/password first)
      user = await this.usersService.findByEmailWithPassword(oauthData.email);

      if (user) {
        // Link OAuth account to existing user
        await this.usersService.linkOAuthAccount(user.id, {
          oauthProvider: oauthData.oauthProvider,
          oauthId: oauthData.oauthId,
          oauthProfile: oauthData.oauthProfile,
        });
      } else {
        // Create new user with OAuth data
        // Default role is APPLICANT for OAuth users
        user = await this.usersService.create({
          email: oauthData.email,
          passwordHash: null, // OAuth users don't need passwords
          role: Role.APPLICANT,
          oauthProvider: oauthData.oauthProvider,
          oauthId: oauthData.oauthId,
          oauthProfile: oauthData.oauthProfile,
          isVerified: true, // OAuth emails are pre-verified
        });

        // Create applicant profile with OAuth data
        try {
          await this.applicantService.createProfile(user.id);
          
          if (oauthData.firstName || oauthData.lastName) {
            const profile = await this.applicantService.getProfile(user);
            profile.firstName = oauthData.firstName || '';
            profile.lastName = oauthData.lastName || '';
            if (oauthData.photoUrl) {
              profile.photoUrl = oauthData.photoUrl;
            }
            await this.applicantService.updateProfile(user, profile);
          }
        } catch (error) {
          console.error('Failed to create OAuth user profile:', error);
        }
      }
    }

    // Fetch complete user data with profile
    const userWithProfile = await this.usersService.findOneByIdWithProfile(user.id);
    
    // Generate tokens
    const payload: JwtPayload = { 
      sub: userWithProfile.id, 
      email: userWithProfile.email, 
      role: userWithProfile.role 
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Remove sensitive data
    const { passwordHash: _, ...userWithoutPassword } = userWithProfile;

    // Extract profile data
    let firstName: string | undefined;
    let lastName: string | undefined;
    let orgName: string | undefined;

    if (userWithProfile.applicantProfile) {
      firstName = userWithProfile.applicantProfile.firstName;
      lastName = userWithProfile.applicantProfile.lastName;
    } else if (userWithProfile.nonprofitOrg) {
      orgName = userWithProfile.nonprofitOrg.orgName;
    }

    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        firstName,
        lastName,
        orgName,
      },
    };
  }

  /**
   * Get user with profile relations loaded
   */
  async getUserWithProfile(userId: string): Promise<User> {
    return this.usersService.findOneByIdWithProfile(userId);
  }

  /**
   * Delete user account and all associated data
   */
  async deleteAccount(userId: string): Promise<{ message: string }> {
    await this.usersService.deleteAccount(userId);
    return { message: 'Account deleted successfully' };
  }
}
