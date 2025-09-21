import { IsEnum, IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SmsProviderType, SmsProviderStatus } from '../entities/sms-provider.entity';

/**
 * @class CreateSmsProviderDto
 * @description DTO for creating SMS provider configuration
 */
export class CreateSmsProviderDto {
  @ApiProperty({ enum: SmsProviderType, description: 'SMS provider type' })
  @IsEnum(SmsProviderType)
  providerType: SmsProviderType;

  @ApiProperty({ description: 'Provider name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Provider description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Provider configuration' })
  @IsObject()
  configuration: any;

  @ApiPropertyOptional({ description: 'Whether provider is active', default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Priority order (lower = higher priority)', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  priority?: number;

  @ApiPropertyOptional({ description: 'Cost per SMS', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerSms?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Supported countries' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCountries?: string[];

  @ApiPropertyOptional({ description: 'Supported features' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedFeatures?: string[];
}

/**
 * @class UpdateSmsProviderDto
 * @description DTO for updating SMS provider configuration
 */
export class UpdateSmsProviderDto {
  @ApiPropertyOptional({ enum: SmsProviderStatus, description: 'Provider status' })
  @IsOptional()
  @IsEnum(SmsProviderStatus)
  status?: SmsProviderStatus;

  @ApiPropertyOptional({ description: 'Provider name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Provider description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Provider configuration' })
  @IsOptional()
  @IsObject()
  configuration?: any;

  @ApiPropertyOptional({ description: 'Whether provider is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Priority order (lower = higher priority)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  priority?: number;

  @ApiPropertyOptional({ description: 'Whether provider is enabled' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Cost per SMS' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerSms?: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Supported countries' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCountries?: string[];

  @ApiPropertyOptional({ description: 'Supported features' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedFeatures?: string[];
}

/**
 * @class SmsProviderResponseDto
 * @description DTO for SMS provider response
 */
export class SmsProviderResponseDto {
  @ApiProperty({ description: 'Provider ID' })
  id: string;

  @ApiProperty({ enum: SmsProviderType, description: 'Provider type' })
  providerType: SmsProviderType;

  @ApiProperty({ enum: SmsProviderStatus, description: 'Provider status' })
  status: SmsProviderStatus;

  @ApiProperty({ description: 'Provider name' })
  name: string;

  @ApiPropertyOptional({ description: 'Provider description' })
  description?: string;

  @ApiProperty({ description: 'Whether provider is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Priority order' })
  priority: number;

  @ApiProperty({ description: 'Whether provider is enabled' })
  isEnabled: boolean;

  @ApiPropertyOptional({ description: 'Cost per SMS' })
  costPerSms?: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Supported countries' })
  supportedCountries: string[];

  @ApiProperty({ description: 'Supported features' })
  supportedFeatures: string[];

  @ApiProperty({ description: 'Last health check timestamp' })
  lastHealthCheck?: Date;

  @ApiProperty({ description: 'Whether provider is healthy' })
  isHealthy: boolean;

  @ApiProperty({ description: 'Total SMS sent' })
  totalSent: number;

  @ApiProperty({ description: 'Total SMS delivered' })
  totalDelivered: number;

  @ApiProperty({ description: 'Delivery rate percentage' })
  deliveryRate: number;

  @ApiProperty({ description: 'Total errors' })
  totalErrors: number;

  @ApiPropertyOptional({ description: 'Last error message' })
  lastError?: string;

  @ApiPropertyOptional({ description: 'Last used timestamp' })
  lastUsed?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

/**
 * @class SendSmsDto
 * @description DTO for sending SMS messages
 */
export class SendSmsDto {
  @ApiProperty({ description: 'Recipient phone number' })
  @IsString()
  recipient: string;

  @ApiProperty({ description: 'SMS message content' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'SMS type', default: 'NOTIFICATION' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Preferred provider ID' })
  @IsOptional()
  @IsString()
  preferredProviderId?: string;

  @ApiPropertyOptional({ description: 'Campaign ID for bulk SMS' })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

/**
 * @class SmsLogResponseDto
 * @description DTO for SMS log response
 */
export class SmsLogResponseDto {
  @ApiProperty({ description: 'Log ID' })
  id: string;

  @ApiProperty({ description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ description: 'Provider name' })
  providerName: string;

  @ApiProperty({ description: 'Recipient phone number' })
  recipient: string;

  @ApiProperty({ description: 'SMS message content' })
  message: string;

  @ApiProperty({ description: 'SMS type' })
  type: string;

  @ApiProperty({ description: 'Delivery status' })
  status: string;

  @ApiPropertyOptional({ description: 'Provider message ID' })
  providerMessageId?: string;

  @ApiPropertyOptional({ description: 'Cost' })
  cost?: number;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiPropertyOptional({ description: 'Error message' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Sent timestamp' })
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'Delivered timestamp' })
  deliveredAt?: Date;

  @ApiPropertyOptional({ description: 'Failed timestamp' })
  failedAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
