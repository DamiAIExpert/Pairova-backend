// src/admin/terms/terms.controller.ts
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TermsService } from './terms.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PolicyType } from '../../common/enums/policy-type.enum';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';

/**
 * @class TermsController
 * @description Provides admin and public endpoints for managing and viewing legal policies.
 */
@ApiTags('Admin')
@Controller('admin/terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  /**
   * @route GET /admin/terms/:type
   * @description Retrieves the current version of a specific policy.
   * @param {PolicyType} type - The type of policy to fetch ('TERMS' or 'PRIVACY').
   * @returns {Promise<Policy>} The policy document.
   */
  @Get(':type')
  @ApiOperation({ summary: 'Get the current version of a policy' })
  @ApiParam({ name: 'type', enum: PolicyType, description: 'The type of policy to retrieve.' })
  @ApiResponse({ status: 200, description: 'The policy document.' })
  current(@Param('type') type: PolicyType) {
    return this.termsService.getPolicy(type);
  }

  /**
   * @route PUT /admin/terms/:type
   * @description Updates a policy document. Restricted to administrators.
   * @param {PolicyType} type - The type of policy to update.
   * @param {UpdatePolicyDto} dto - The new content and metadata for the policy.
   * @param {User} admin - The authenticated admin user.
   * @returns {Promise<Policy>} The updated policy document.
   */
  @Put(':type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a policy document (Admin only)' })
  @ApiParam({ name: 'type', enum: PolicyType, description: 'The type of policy to update.' })
  update(@Param('type') type: PolicyType, @Body() dto: UpdatePolicyDto, @CurrentUser() admin: User) {
    return this.termsService.updatePolicy(type, dto, admin);
  }
}
