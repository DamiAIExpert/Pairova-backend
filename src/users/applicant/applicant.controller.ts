// src/users/applicant/applicant.controller.ts
import { Body, Controller, Get, Put, Patch, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicantService } from './applicant.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../shared/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { UpdatePrivacySettingsDto } from './dto/update-privacy-settings.dto';
import { PrivacySettingsResponseDto } from './dto/privacy-settings-response.dto';
import { ApplicantProfile } from './applicant.entity';

/**
 * @class ApplicantController
 * @description Manages endpoints for applicant-specific actions, such as viewing and updating their profile.
 */
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
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

  /**
   * @route GET /profiles/applicant/privacy
   * @description Retrieves the privacy settings of the currently authenticated applicant.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<PrivacySettingsResponseDto>} The applicant's privacy settings.
   */
  @Get('privacy')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Get the current applicant\'s privacy settings' })
  @ApiResponse({ 
    status: 200, 
    description: 'The applicant privacy settings.', 
    type: PrivacySettingsResponseDto 
  })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an applicant.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  getPrivacySettings(@CurrentUser() user: User): Promise<PrivacySettingsResponseDto> {
    return this.applicantService.getPrivacySettings(user);
  }

  /**
   * @route PATCH /profiles/applicant/privacy
   * @description Updates the privacy settings of the currently authenticated applicant.
   * @param {User} user - The authenticated user object.
   * @param {UpdatePrivacySettingsDto} updateDto - The privacy settings to update.
   * @returns {Promise<PrivacySettingsResponseDto>} The updated privacy settings.
   */
  @Patch('privacy')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Update the current applicant\'s privacy settings' })
  @ApiResponse({ 
    status: 200, 
    description: 'The updated privacy settings.', 
    type: PrivacySettingsResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not an applicant.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  updatePrivacySettings(
    @CurrentUser() user: User,
    @Body() updateDto: UpdatePrivacySettingsDto,
  ): Promise<PrivacySettingsResponseDto> {
    return this.applicantService.updatePrivacySettings(user, updateDto);
  }
}
