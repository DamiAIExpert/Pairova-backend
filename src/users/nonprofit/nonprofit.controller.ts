// src/users/nonprofit/nonprofit.controller.ts
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NonprofitService } from './nonprofit.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../shared/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { UpdateNonprofitProfileDto } from './dto/update-nonprofit-profile.dto';
import { NonprofitOrg } from './nonprofit.entity';

/**
 * @class NonprofitController
 * @description Manages endpoints for non-profit-specific actions.
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profiles/nonprofit')
export class NonprofitController {
  constructor(private readonly nonprofitService: NonprofitService) {}

  /**
   * @route GET /profiles/nonprofit/me
   * @description Retrieves the profile of the currently authenticated non-profit organization.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<NonprofitOrg>} The organization's profile.
   */
  @Get('me')
  @Roles(Role.NONPROFIT)
  @ApiOperation({ summary: 'Get the current non-profit\'s profile' })
  @ApiResponse({ status: 200, description: 'The non-profit profile.', type: NonprofitOrg })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a non-profit.' })
  me(@CurrentUser() user: User): Promise<NonprofitOrg> {
    return this.nonprofitService.getProfile(user);
  }

  /**
   * @route PUT /profiles/nonprofit/me
   * @description Updates the profile of the currently authenticated non-profit organization.
   * @param {User} user - The authenticated user object.
   * @param {UpdateNonprofitProfileDto} updateDto - The data to update.
   * @returns {Promise<NonprofitOrg>} The updated organization profile.
   */
  @Put('me')
  @Roles(Role.NONPROFIT)
  @ApiOperation({ summary: 'Update the current non-profit\'s profile' })
  @ApiResponse({ status: 200, description: 'The updated non-profit profile.', type: NonprofitOrg })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a non-profit.' })
  update(
    @CurrentUser() user: User,
    @Body() updateDto: UpdateNonprofitProfileDto,
  ): Promise<NonprofitOrg> {
    return this.nonprofitService.updateProfile(user, updateDto);
  }
}
