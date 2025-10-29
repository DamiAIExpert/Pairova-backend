// src/profiles/experience/experience.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { Experience } from './entities/experience.entity';

@ApiTags('Profile - Experience')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles/experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @ApiOperation({ summary: "Add a work experience entry to the current user's profile" })
  @ApiResponse({ status: 201, description: 'The experience entry has been successfully created.', type: Experience })
  add(@CurrentUser() user: User, @Body() createExperienceDto: CreateExperienceDto): Promise<Experience> {
    return this.experienceService.addExperience(user, createExperienceDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all work experience entries for the current user's profile" })
  @ApiResponse({ status: 200, description: 'A list of work experience entries.', type: [Experience] })
  findAll(@CurrentUser() user: User): Promise<Experience[]> {
    return this.experienceService.findByUserId(user.id);
  }
}
