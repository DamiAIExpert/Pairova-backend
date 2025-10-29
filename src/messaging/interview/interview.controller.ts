// src/messaging/interview/interview.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InterviewService } from './interview.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';

@ApiTags('Messaging')
@Controller('interviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new interview for an application' })
  @ApiResponse({ status: 201, description: 'Interview scheduled successfully.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  schedule(@Body() dto: ScheduleInterviewDto, @CurrentUser() user: User) {
    return this.interviewService.schedule(dto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single interview' })
  @ApiResponse({ status: 200, description: 'Returns the interview details.'})
  @ApiResponse({ status: 404, description: 'Interview not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.interviewService.findOne(id);
  }
}
