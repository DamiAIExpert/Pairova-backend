// src/admin/terms/dto/update-policy.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsDateString } from 'class-validator';
import { PolicyType } from '../../../common/enums/policy-type.enum';

/**
 * @class UpdatePolicyDto
 * @description DTO for updating a legal policy document.
 */
export class UpdatePolicyDto {
  @ApiProperty({ description: 'The new version identifier for the policy', example: 'v1.1.0' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    description: 'The rich JSON content of the policy document',
    example: { blocks: [{ type: 'paragraph', data: { text: 'Welcome to Pairova.' } }] },
  })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;

  @ApiProperty({ description: 'The date this version of the policy becomes effective' })
  @IsDateString()
  @IsNotEmpty()
  effectiveAt: Date;
}
