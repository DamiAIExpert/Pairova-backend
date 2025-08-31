// src/common/dto/pagination.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * @class PaginationDto
 * @description A Data Transfer Object for handling pagination parameters in API requests.
 * It includes validation rules to ensure that page and limit are positive integers.
 */
export class PaginationDto {
  /**
   * @property {number} page
   * @description The page number to retrieve. Defaults to 1.
   */
  @ApiPropertyOptional({
    description: 'The page number to retrieve.',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  /**
   * @property {number} limit
   * @description The number of items to retrieve per page. Defaults to 10.
   */
  @ApiPropertyOptional({
    description: 'The number of items to retrieve per page.',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Set a reasonable max limit to prevent abuse
  limit: number = 10;
}

