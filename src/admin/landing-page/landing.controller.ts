// src/admin/landing-page/landing.controller.ts
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LandingService } from './landing.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { UpsertPageDto } from '../pages/dto/upsert-page.dto';

/**
 * @class LandingController
 * @description Provides a dedicated endpoint for admins to manage the landing page content.
 */
@ApiTags('Admin - CMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get()
  @ApiOperation({ summary: 'Get the landing page content' })
  get() {
    return this.landingService.get();
  }

  @Put()
  @ApiOperation({ summary: 'Update the landing page content' })
  set(@Body() dto: UpsertPageDto, @CurrentUser() admin: User) {
    return this.landingService.set(dto, admin);
  }
}
