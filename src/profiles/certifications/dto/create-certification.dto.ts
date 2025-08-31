// src/profiles/certifications/dto/create-certification.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsDateString } from 'class-validator';

/**
 * @class CreateCertificationDto
 * @description Data transfer object for creating a new certification record.
 */
export class CreateCertificationDto {
  @ApiProperty({ description: 'The name of the certification.' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'The organization that issued the certification.' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ description: 'The date the certification was issued.', example: '2023-10-26' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ description: 'A URL to the credential for verification.' })
  @IsOptional()
  @IsUrl()
  credentialUrl?: string;
}

