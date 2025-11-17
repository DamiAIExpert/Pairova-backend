// src/profiles/experience/experience.controller.ts
import { Body, Controller, Get, Post, UseGuards, Param, Delete, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
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

  /**
   * @route DELETE /profiles/experience/:id
   * @description Deletes a specific experience entry for the currently authenticated user.
   * Ensures that a user can only delete their own experience entries.
   * @param {string} id - The UUID of the experience entry to delete.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an experience entry from the current user\'s profile' })
  @ApiResponse({ status: 204, description: 'The experience entry has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this resource.' })
  @ApiResponse({ status: 404, description: 'Not Found - The experience entry with the given ID does not exist.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    const experience = await this.experienceService.findOneById(id);
    if (experience.userId !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this experience entry.');
    }
    return this.experienceService.remove(id);
  }
}
