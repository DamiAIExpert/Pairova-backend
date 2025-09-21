// src/admin/users/dto/update-user-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsEnum, IsString } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Whether to verify the user', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'User role', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ description: 'User phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
