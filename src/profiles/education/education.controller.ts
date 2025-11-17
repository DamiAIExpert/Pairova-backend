// src/profiles/education/education.controller.ts
import { Body, Controller, Get, Post, UseGuards, Param, Delete, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
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

  /**
   * @route DELETE /profiles/education/:id
   * @description Deletes a specific education entry for the currently authenticated user.
   * Ensures that a user can only delete their own education entries.
   * @param {string} id - The UUID of the education entry to delete.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an education entry from the current user\'s profile' })
  @ApiResponse({ status: 204, description: 'The education entry has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this resource.' })
  @ApiResponse({ status: 404, description: 'Not Found - The education entry with the given ID does not exist.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    const education = await this.educationService.findOneById(id);
    if (education.userId !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this education entry.');
    }
    return this.educationService.remove(id);
  }
}
