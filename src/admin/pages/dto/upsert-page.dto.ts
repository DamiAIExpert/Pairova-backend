// src/admin/pages/dto/upsert-page.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpsertPageDto {
  @ApiProperty({ description: 'The title of the page.' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'The JSON content for the page body.' })
  @IsObject()
  content!: Record<string, any>;

  @ApiPropertyOptional({ description: 'URL for the hero image.' })
  @IsOptional()
  @IsString()
  heroImageUrl?: string;
}

