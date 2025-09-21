// src/admin/ngos/dto/update-ngo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsDateString } from 'class-validator';

export class UpdateNgoDto {
  @ApiProperty({ description: 'Whether to verify the user', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'User phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Organization name', required: false })
  @IsOptional()
  @IsString()
  orgName?: string;

  @ApiProperty({ description: 'Organization website', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Organization mission', required: false })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiProperty({ description: 'Organization values', required: false })
  @IsOptional()
  @IsString()
  values?: string;

  @ApiProperty({ description: 'Organization size label', required: false })
  @IsOptional()
  @IsString()
  sizeLabel?: string;

  @ApiProperty({ description: 'Organization type', required: false })
  @IsOptional()
  @IsString()
  orgType?: string;

  @ApiProperty({ description: 'Industry', required: false })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ description: 'Founded date (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  foundedOn?: string;

  @ApiProperty({ description: 'Tax ID', required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Address line 1', required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;
}
