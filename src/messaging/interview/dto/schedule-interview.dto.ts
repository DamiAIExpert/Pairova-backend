// src/messaging/interview/dto/schedule-interview.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class ScheduleInterviewDto {
  @ApiProperty({ description: 'The UUID of the application for the interview.' })
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ description: 'The start date and time of the interview (ISO 8601 format).' })
  @IsDateString()
  @IsNotEmpty()
  startAt: string;

  @ApiProperty({
    description: 'The end date and time of the interview (ISO 8601 format).',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiProperty({
    description: 'A URL for the video meeting (e.g., Google Meet, Zoom).',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  meetingLink?: string;
}
