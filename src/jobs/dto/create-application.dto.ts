// src/jobs/dto/create-application.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ description: 'The UUID of the job being applied for.' })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    description: 'A cover letter for the application.',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({
    description: 'The UUID of the uploaded resume file.',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  resumeUploadId?: string;
}
