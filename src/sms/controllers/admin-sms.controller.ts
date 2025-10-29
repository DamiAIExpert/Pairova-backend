import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { SmsService } from '../services/sms.service';
import { CreateSmsProviderDto, UpdateSmsProviderDto, SmsProviderResponseDto, SmsLogResponseDto } from '../dto/sms-provider.dto';
import { SmsStatus, SmsType } from '../entities/sms-log.entity';

/**
 * @class AdminSmsController
 * @description Admin controller for SMS provider management and configuration
 */
@ApiTags('Admin')
@Controller('admin/sms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminSmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   * Create new SMS provider
   */
  @Post('providers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new SMS provider configuration' })
  @ApiResponse({
    status: 201,
    description: 'SMS provider created successfully',
    type: SmsProviderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid provider configuration' })
  async createProvider(
    @Body(ValidationPipe) createProviderDto: CreateSmsProviderDto,
  ): Promise<SmsProviderResponseDto> {
    return await this.smsService.createProvider(createProviderDto);
  }

  /**
   * Get all SMS providers
   */
  @Get('providers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all SMS providers' })
  @ApiResponse({
    status: 200,
    description: 'SMS providers retrieved successfully',
    type: [SmsProviderResponseDto],
  })
  async getProviders(): Promise<SmsProviderResponseDto[]> {
    return await this.smsService.getProviders();
  }

  /**
   * Get SMS provider by ID
   */
  @Get('providers/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get SMS provider by ID' })
  @ApiResponse({
    status: 200,
    description: 'SMS provider retrieved successfully',
    type: SmsProviderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  async getProvider(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SmsProviderResponseDto> {
    return await this.smsService.getProvider(id);
  }

  /**
   * Update SMS provider
   */
  @Put('providers/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update SMS provider configuration' })
  @ApiResponse({
    status: 200,
    description: 'SMS provider updated successfully',
    type: SmsProviderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  @ApiResponse({ status: 400, description: 'Invalid provider configuration' })
  async updateProvider(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateProviderDto: UpdateSmsProviderDto,
  ): Promise<SmsProviderResponseDto> {
    return await this.smsService.updateProvider(id, updateProviderDto);
  }

  /**
   * Delete SMS provider
   */
  @Delete('providers/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete SMS provider' })
  @ApiResponse({
    status: 200,
    description: 'SMS provider deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  async deleteProvider(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.smsService.deleteProvider(id);
    return { message: 'SMS provider deleted successfully' };
  }

  /**
   * Toggle provider active status
   */
  @Put('providers/:id/toggle')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Toggle SMS provider active status' })
  @ApiResponse({
    status: 200,
    description: 'Provider status toggled successfully',
    type: SmsProviderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  async toggleProviderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<SmsProviderResponseDto> {
    return await this.smsService.toggleProviderStatus(id, isActive);
  }

  /**
   * Update provider priority
   */
  @Put('providers/:id/priority')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update SMS provider priority' })
  @ApiResponse({
    status: 200,
    description: 'Provider priority updated successfully',
    type: SmsProviderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  async updateProviderPriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('priority') priority: number,
  ): Promise<SmsProviderResponseDto> {
    return await this.smsService.updateProviderPriority(id, priority);
  }

  /**
   * Perform health check on provider
   */
  @Post('providers/:id/health-check')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Perform health check on SMS provider' })
  @ApiResponse({
    status: 200,
    description: 'Health check completed successfully',
  })
  @ApiResponse({ status: 404, description: 'SMS provider not found' })
  async performHealthCheck(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.smsService.performHealthCheck(id);
    return { message: 'Health check completed successfully' };
  }

  /**
   * Perform health check on all providers
   */
  @Post('providers/health-check-all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Perform health check on all SMS providers' })
  @ApiResponse({
    status: 200,
    description: 'Health check completed for all providers',
  })
  async performHealthCheckAll(): Promise<{ message: string }> {
    await this.smsService.performHealthCheckAll();
    return { message: 'Health check completed for all providers' };
  }

  /**
   * Get SMS logs with filtering and pagination
   */
  @Get('logs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get SMS logs with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'SMS logs retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' })
  @ApiQuery({ name: 'status', required: false, enum: SmsStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, enum: SmsType, description: 'Filter by type' })
  @ApiQuery({ name: 'recipient', required: false, type: String, description: 'Filter by recipient' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Filter from date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Filter to date (ISO string)' })
  async getSmsLogs(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
    @Query('providerId') providerId?: string,
    @Query('status') status?: SmsStatus,
    @Query('type') type?: SmsType,
    @Query('recipient') recipient?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{
    logs: SmsLogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filters: any = {};
    
    if (providerId) filters.providerId = providerId;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (recipient) filters.recipient = recipient;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const result = await this.smsService.getSmsLogs(page, limit, filters);
    
    return {
      ...result,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  /**
   * Get SMS statistics
   */
  @Get('statistics')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get SMS statistics and analytics' })
  @ApiResponse({
    status: 200,
    description: 'SMS statistics retrieved successfully',
  })
  async getSmsStatistics(): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    deliveryRate: number;
    totalCost: number;
    providerStats: Array<{
      providerId: string;
      providerName: string;
      totalSent: number;
      totalDelivered: number;
      deliveryRate: number;
      totalCost: number;
    }>;
  }> {
    return await this.smsService.getSmsStatistics();
  }

  /**
   * Send test SMS
   */
  @Post('test')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Send test SMS message' })
  @ApiResponse({
    status: 200,
    description: 'Test SMS sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to send test SMS' })
  async sendTestSms(
    @Body() body: { recipient: string; message?: string; providerId?: string },
  ): Promise<{ message: string; logId: string }> {
    const testMessage = body.message || 'Test SMS from Pairova Admin Panel';
    
    const smsLog = await this.smsService.sendSms({
      recipient: body.recipient,
      message: testMessage,
      type: SmsType.SYSTEM,
      preferredProviderId: body.providerId,
      metadata: {
        source: 'admin_test',
        testMessage: true,
      },
    });

    return {
      message: 'Test SMS sent successfully',
      logId: smsLog.id,
    };
  }

  /**
   * Get supported SMS provider types
   */
  @Get('provider-types')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get supported SMS provider types' })
  @ApiResponse({
    status: 200,
    description: 'Supported provider types retrieved successfully',
  })
  async getSupportedProviderTypes(): Promise<{
    types: Array<{
      type: string;
      name: string;
      description: string;
      features: string[];
      website?: string;
    }>;
  }> {
    return {
      types: [
        {
          type: 'TWILIO',
          name: 'Twilio',
          description: 'Global SMS provider with robust API and excellent delivery rates',
          features: ['bulk', 'unicode', 'delivery_reports', 'scheduling', 'international'],
          website: 'https://www.twilio.com',
        },
        {
          type: 'CLICKATELL',
          name: 'Clickatell',
          description: 'Enterprise SMS platform with high delivery rates',
          features: ['bulk', 'unicode', 'delivery_reports', 'scheduling'],
          website: 'https://www.clickatell.com',
        },
        {
          type: 'MSG91',
          name: 'MSG91',
          description: 'Popular SMS provider in South Africa with competitive pricing',
          features: ['bulk', 'unicode', 'delivery_reports'],
          website: 'https://msg91.com',
        },
        {
          type: 'AFRICASTALKING',
          name: 'Africastalking',
          description: 'African-focused SMS provider with local expertise',
          features: ['bulk', 'unicode', 'delivery_reports'],
          website: 'https://africastalking.com',
        },
        {
          type: 'NEXMO',
          name: 'Nexmo (Vonage)',
          description: 'Reliable SMS service with competitive pricing',
          features: ['bulk', 'unicode', 'delivery_reports'],
          website: 'https://www.vonage.com',
        },
        {
          type: 'CM_COM',
          name: 'CM.com',
          description: 'European SMS provider with strong API capabilities',
          features: ['bulk', 'unicode', 'delivery_reports', 'scheduling'],
          website: 'https://www.cm.com',
        },
        {
          type: 'TELESIGN',
          name: 'Telesign',
          description: 'Global communications platform with SMS capabilities',
          features: ['bulk', 'unicode', 'delivery_reports'],
          website: 'https://www.telesign.com',
        },
      ],
    };
  }
}
