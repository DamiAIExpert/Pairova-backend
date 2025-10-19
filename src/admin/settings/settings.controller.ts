// src/admin/settings/settings.controller.ts
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
import { UpdateSmsSettingsDto } from './dto/update-sms-settings.dto';

/**
 * @class SettingsController
 * @description Provides admin endpoints for managing platform settings.
 */
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('email')
  @ApiOperation({ summary: 'Get all email provider configurations' })
  getEmailSettings() {
    return this.settingsService.getEmailSettings();
  }

  @Put('email')
  @ApiOperation({ summary: 'Create or update an email provider configuration' })
  upsertEmailSettings(@Body() dto: UpdateEmailSettingsDto, @CurrentUser() admin: User) {
    return this.settingsService.upsertEmailSettings(dto, admin);
  }

  @Get('sms')
  @ApiOperation({ summary: 'Get all SMS provider configurations' })
  getSmsSettings() {
    return this.settingsService.getSmsSettings();
  }

  @Put('sms')
  @ApiOperation({ summary: 'Create or update an SMS provider configuration' })
  upsertSmsSettings(@Body() dto: UpdateSmsSettingsDto, @CurrentUser() admin: User) {
    return this.settingsService.upsertSmsSettings(dto, admin);
  }
}
