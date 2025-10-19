// src/users/applicant/applicant.controller.ts
import { Body, Controller, Get, Put, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicantService } from './applicant.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../shared/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { ApplicantProfile } from './applicant.entity';

/**
 * @class ApplicantController
 * @description Manages endpoints for applicant-specific actions, such as viewing and updating their profile.
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profiles/applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  /**
   * @route GET /profiles/applicant/me
   * @description Retrieves the profile of the currently authenticated applicant.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<ApplicantProfile>} The applicant's profile.
   */
  @Get('me')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Get the current applicant\'s profile' })
  @ApiResponse({ status: 200, description: 'The applicant profile.', type: ApplicantProfile })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an applicant.' })
  me(@CurrentUser() user: User): Promise<ApplicantProfile> {
    return this.applicantService.getProfile(user);
  }

  /**
   * @route PUT /profiles/applicant/me
   * @description Updates the profile of the currently authenticated applicant.
   * @param {User} user - The authenticated user object.
   * @param {UpdateApplicantProfileDto} updateDto - The data to update.
   * @returns {Promise<ApplicantProfile>} The updated applicant profile.
   */
  @Put('me')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Update the current applicant\'s profile' })
  @ApiResponse({ status: 200, description: 'The updated applicant profile.', type: ApplicantProfile })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an applicant.' })
  update(
    @CurrentUser() user: User,
    @Body() updateDto: UpdateApplicantProfileDto,
  ): Promise<ApplicantProfile> {
    return this.applicantService.updateProfile(user, updateDto);
  }
}
