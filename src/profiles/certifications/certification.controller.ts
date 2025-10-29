// src/profiles/certifications/certification.controller.ts
import { Controller, Get, Post, Body, UseGuards, Param, Delete, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { Certification } from './entities/certification.entity';

/**
 * @class CertificationController
 * @description Handles HTTP requests for managing user certification records.
 * All endpoints are protected and require JWT authentication.
 */
@ApiTags('Profile - Certifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles/certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  /**
   * @route POST /profiles/certifications
   * @description Adds a new certification record to the currently authenticated user's profile.
   * @param {User} user - The authenticated user object, injected by the `CurrentUser` decorator.
   * @param {CreateCertificationDto} createCertificationDto - The DTO containing the new certification's data.
   * @returns {Promise<Certification>} The newly created certification entity.
   */
  @Post()
  @ApiOperation({ summary: "Add a new certification to the current user's profile" })
  @ApiResponse({ status: 201, description: 'The certification has been successfully created.', type: Certification })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  add(
    @CurrentUser() user: User,
    @Body() createCertificationDto: CreateCertificationDto,
  ): Promise<Certification> {
    return this.certificationService.add(user, createCertificationDto);
  }

  /**
   * @route GET /profiles/certifications
   * @description Retrieves all certification records for the currently authenticated user.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<Certification[]>} An array of the user's certification entities.
   */
  @Get()
  @ApiOperation({ summary: "Get all certifications for the current user's profile" })
  @ApiResponse({ status: 200, description: 'A list of the user\'s certifications.', type: [Certification] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  findAll(@CurrentUser() user: User): Promise<Certification[]> {
    return this.certificationService.findAllByUserId(user.id);
  }

  /**
   * @route DELETE /profiles/certifications/:id
   * @description Deletes a specific certification record for the currently authenticated user.
   * Ensures that a user can only delete their own certifications.
   * @param {string} id - The UUID of the certification to delete.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a certification from the current user\'s profile' })
  @ApiResponse({ status: 204, description: 'The certification has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this resource.' })
  @ApiResponse({ status: 404, description: 'Not Found - The certification with the given ID does not exist.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    const certification = await this.certificationService.findOneById(id);
    if (certification.userId !== user.id) {
        throw new ForbiddenException('You are not authorized to delete this certification.');
    }
    return this.certificationService.remove(id);
  }
}

