// src/admin/settings/dto/update-sms-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';
import { SmsProvider } from '../../../common/enums/sms-provider.enum';
import { SmsStatus } from '../../../common/enums/sms-status.enum';

/**
 * @class UpdateSmsSettingsDto
 * @description DTO for creating or updating SMS provider settings.
 */
export class UpdateSmsSettingsDto {
  @ApiProperty({ enum: SmsProvider, description: 'The SMS provider' })
  @IsEnum(SmsProvider)
  @IsNotEmpty()
  provider: SmsProvider;

  @ApiProperty({ description: 'API Key for the SMS provider' })
  @IsString()
  @IsNotEmpty()
  apiKey: string; // Will be encrypted

  @ApiProperty({ description: 'Sender ID (e.g., a short code or brand name)' })
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ description: 'Primary country for this provider', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ enum: SmsStatus, description: 'The status of this provider configuration' })
  @IsEnum(SmsStatus)
  @IsOptional()
  status?: SmsStatus;
}
