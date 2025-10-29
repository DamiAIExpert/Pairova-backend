// src/profiles/education/education.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { Education } from './entities/education.entity';

@ApiTags('Profile - Education')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @ApiOperation({ summary: "Add an education entry to the current user's profile" })
  @ApiResponse({ status: 201, description: 'The education entry has been successfully created.', type: Education })
  add(@CurrentUser() user: User, @Body() createEducationDto: CreateEducationDto): Promise<Education> {
    return this.educationService.addEducation(user, createEducationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all education entries for the current user's profile" })
  @ApiResponse({ status: 200, description: 'A list of education entries.', type: [Education] })
  findAll(@CurrentUser() user: User): Promise<Education[]> {
    return this.educationService.findByUserId(user.id);
  }
}
