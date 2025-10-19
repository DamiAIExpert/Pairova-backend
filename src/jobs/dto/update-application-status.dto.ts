import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../common/enums/job.enum';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'New status for the application',
    enum: ApplicationStatus,
    example: ApplicationStatus.REVIEWED,
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiProperty({
    description: 'Optional notes about the status change',
    example: 'Candidate has strong technical background',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
