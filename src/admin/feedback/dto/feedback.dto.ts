// src/admin/feedback/dto/feedback.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';
import { FeedbackStatus, FeedbackPriority, FeedbackCategory } from '../entities/feedback.entity';

export class FeedbackDto {
  @ApiProperty({ description: 'Feedback ID' })
  id: string;

  @ApiProperty({ description: 'Feedback title' })
  title: string;

  @ApiProperty({ description: 'Feedback description' })
  description: string;

  @ApiProperty({ description: 'Feedback category', enum: FeedbackCategory })
  category: FeedbackCategory;

  @ApiProperty({ description: 'Feedback status', enum: FeedbackStatus })
  status: FeedbackStatus;

  @ApiProperty({ description: 'Feedback priority', enum: FeedbackPriority })
  priority: FeedbackPriority;

  @ApiProperty({ description: 'User email who submitted feedback', required: false })
  userEmail?: string;

  @ApiProperty({ description: 'User name who submitted feedback', required: false })
  userName?: string;

  @ApiProperty({ description: 'User ID who submitted feedback', required: false })
  userId?: string;

  @ApiProperty({ description: 'Admin notes', required: false })
  adminNotes?: string;

  @ApiProperty({ description: 'Assigned to user ID', required: false })
  assignedToId?: string;

  @ApiProperty({ description: 'Assigned to user name', required: false })
  assignedToName?: string;

  @ApiProperty({ description: 'Browser information', required: false })
  browserInfo?: string;

  @ApiProperty({ description: 'Device information', required: false })
  deviceInfo?: string;

  @ApiProperty({ description: 'Page URL where feedback was submitted', required: false })
  pageUrl?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class FeedbackListDto {
  @ApiProperty({ type: [FeedbackDto], description: 'List of feedback items' })
  data: FeedbackDto[];

  @ApiProperty({ description: 'Total number of feedback items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
}

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Feedback title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Feedback description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Feedback category', enum: FeedbackCategory, default: FeedbackCategory.GENERAL })
  @IsEnum(FeedbackCategory)
  @IsOptional()
  category?: FeedbackCategory;

  @ApiProperty({ description: 'User email', required: false })
  @IsString()
  @IsOptional()
  userEmail?: string;

  @ApiProperty({ description: 'User name', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'Browser information', required: false })
  @IsString()
  @IsOptional()
  browserInfo?: string;

  @ApiProperty({ description: 'Device information', required: false })
  @IsString()
  @IsOptional()
  deviceInfo?: string;

  @ApiProperty({ description: 'Page URL where feedback was submitted', required: false })
  @IsString()
  @IsOptional()
  pageUrl?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateFeedbackDto {
  @ApiProperty({ description: 'Feedback status', enum: FeedbackStatus, required: false })
  status?: FeedbackStatus;

  @ApiProperty({ description: 'Feedback priority', enum: FeedbackPriority, required: false })
  priority?: FeedbackPriority;

  @ApiProperty({ description: 'Admin notes', required: false })
  adminNotes?: string;

  @ApiProperty({ description: 'Assigned to user ID', required: false })
  assignedToId?: string;
}
