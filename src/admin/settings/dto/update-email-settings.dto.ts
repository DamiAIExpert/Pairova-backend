// src/admin/settings/dto/update-email-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';
import { ProviderType } from '../../../common/enums/provider-type.enum';

/**
 * @class UpdateEmailSettingsDto
 * @description DTO for creating or updating email provider settings.
 */
export class UpdateEmailSettingsDto {
  @ApiProperty({ enum: ProviderType, description: 'The email provider type', default: ProviderType.SMTP })
  @IsEnum(ProviderType)
  @IsOptional()
  provider?: ProviderType;

  @ApiProperty({ description: 'SMTP server host', example: 'smtp.example.com', required: false })
  @IsString()
  @IsOptional()
  smtpHost?: string;

  @ApiProperty({ description: 'SMTP server port', example: 587, required: false })
  @IsNumber()
  @IsOptional()
  smtpPort?: number;

  @ApiProperty({ description: 'SMTP username', example: 'user@example.com', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'SMTP password or API key', example: 'supersecret', required: false })
  @IsString()
  @IsOptional()
  password?: string; // Will be encrypted in the service

  @ApiProperty({ description: 'The "From" address for outgoing emails', example: 'Pairova <noreply@pairova.com>' })
  @IsString()
  @IsNotEmpty()
  fromAddress: string;

  @ApiProperty({ description: 'Whether to use a secure TLS connection', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  secureTls?: boolean;

  @ApiProperty({ description: 'Enable testing mode (prevents actual sending)', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  testingMode?: boolean;
}
