// src/admin/users/dto/admin-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class AdminUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User role', enum: Role })
  role: Role;

  @ApiProperty({ description: 'Whether user is verified' })
  isVerified: boolean;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Account creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  // Profile information (union of applicant and nonprofit fields)
  @ApiProperty({ description: 'First name (for applicants)', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Last name (for applicants)', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Organization name (for nonprofits)', required: false })
  orgName?: string;

  @ApiProperty({ description: 'Profile photo URL', required: false })
  photoUrl?: string;

  @ApiProperty({ description: 'Organization logo URL (for nonprofits)', required: false })
  logoUrl?: string;

  @ApiProperty({ description: 'City', required: false })
  city?: string;

  @ApiProperty({ description: 'Country', required: false })
  country?: string;

  @ApiProperty({ description: 'Application count for applicants', required: false })
  applicationCount?: number;

  @ApiProperty({ description: 'Job count for nonprofits', required: false })
  jobCount?: number;
}

export class AdminUserListDto {
  @ApiProperty({ type: [AdminUserDto], description: 'List of users' })
  data: AdminUserDto[];

  @ApiProperty({ description: 'Total number of users' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Whether to verify the user', required: false })
  isVerified?: boolean;

  @ApiProperty({ description: 'User role', enum: Role, required: false })
  role?: Role;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;
}
