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
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/strategies/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { EmailService } from './email.service';
import { ReminderService } from './reminder.service';
import { NotificationService } from './notification.service';
import { NotificationPreferencesService } from './notification-preferences.service';

/**
 * @class NotificationsController
 * @description Controller for managing email notifications and reminders
 */
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(
    private readonly emailService: EmailService,
    private readonly reminderService: ReminderService,
    private readonly notificationService: NotificationService,
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  /**
   * Send email notification
   */
  @Post('email')
  @ApiOperation({ summary: 'Send email notification' })
  @ApiResponse({
    status: 201,
    description: 'Email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Email service error' })
  async sendEmail(
    @Body() emailData: {
      to: string;
      subject: string;
      template?: string;
      html?: string;
      data?: any;
    },
    @Request() req,
  ): Promise<{ message: string; messageId?: string }> {
    let result;
    if (emailData.template) {
      result = await this.emailService.sendFromTemplate(
        emailData.to,
        emailData.subject,
        emailData.template,
        emailData.data || {},
      );
    } else {
      result = await this.emailService.send(
        emailData.to,
        emailData.subject,
        emailData.html || '',
      );
    }
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return {
      message: 'Email sent successfully',
      messageId: result.messageId,
    };
  }

  /**
   * Get user's email notifications
   */
  @Get('email/history')
  @ApiOperation({ summary: 'Get user email notification history' })
  @ApiResponse({
    status: 200,
    description: 'Email history retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getEmailHistory(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ): Promise<{ emails: any[]; total: number; page: number; limit: number }> {
    // TODO: Implement email history retrieval
    return {
      emails: [],
      total: 0,
      page,
      limit,
    };
  }

  /**
   * Create a reminder
   */
  @Post('reminders')
  @ApiOperation({ summary: 'Create a new reminder' })
  @ApiResponse({
    status: 201,
    description: 'Reminder created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createReminder(
    @Body() reminderData: {
      title: string;
      description?: string;
      remindAt: Date;
      type: string;
    },
    @Request() req,
  ): Promise<{ message: string; reminderId: string }> {
    const reminder = await this.reminderService.scheduleReminder(
      req.user,
      'EMAIL' as any, // Using ChannelType.EMAIL
      reminderData.title,
      {
        description: reminderData.description,
        type: reminderData.type,
      },
      new Date(reminderData.remindAt),
    );
    return {
      message: 'Reminder created successfully',
      reminderId: reminder.id,
    };
  }

  /**
   * Get user's reminders
   */
  @Get('reminders')
  @ApiOperation({ summary: 'Get user reminders' })
  @ApiResponse({
    status: 200,
    description: 'Reminders retrieved successfully',
  })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async getReminders(
    @Request() req,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ): Promise<{ reminders: any[]; total: number; page: number; limit: number }> {
    // TODO: Implement getUserReminders method in ReminderService
    return {
      reminders: [],
      total: 0,
      page,
      limit,
    };
  }

  /**
   * Update reminder status
   */
  @Put('reminders/:id')
  @ApiOperation({ summary: 'Update reminder status' })
  @ApiResponse({
    status: 200,
    description: 'Reminder updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found' })
  async updateReminder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: { status: string; completedAt?: Date },
    @Request() req,
  ): Promise<{ message: string }> {
    // TODO: Implement updateReminder method in ReminderService
    return { message: 'Reminder updated successfully' };
  }

  /**
   * Delete reminder
   */
  @Delete('reminders/:id')
  @ApiOperation({ summary: 'Delete reminder' })
  @ApiResponse({
    status: 200,
    description: 'Reminder deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Reminder not found' })
  async deleteReminder(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    // TODO: Implement deleteReminder method in ReminderService
    return { message: 'Reminder deleted successfully' };
  }


  /**
   * Get user notifications
   */
  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean, description: 'Show only unread notifications' })
  async getNotifications(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('unreadOnly') unreadOnly: boolean = false,
  ): Promise<{
    notifications: any[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  }> {
    return this.notificationService.getUserNotifications(
      req.user.id,
      page,
      limit,
      unreadOnly,
    );
  }

  /**
   * Mark notification as read
   */
  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.notificationService.markAsRead(id, req.user.id);
    return { message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read
   */
  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  async markAllAsRead(@Request() req): Promise<{ message: string; count: number }> {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  /**
   * Delete notification
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async deleteNotification(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.notificationService.deleteNotification(id, req.user.id);
    return { message: 'Notification deleted successfully' };
  }

  /**
   * Get notification statistics for user
   */
  @Get('stats')
  @ApiOperation({ summary: 'Get user notification statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getUserNotificationStats(@Request() req): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    return this.notificationService.getUserNotificationStats(req.user.id);
  }

  /**
   * Get notification preferences
   */
  @Get('preferences')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
  })
  async getPreferences(@Request() req): Promise<any> {
    return this.preferencesService.getPreferencesForApi(req.user.id);
  }

  /**
   * Update notification preferences
   */
  @Put('preferences')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
  })
  async updatePreferences(
    @Body() preferences: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      reminders?: boolean;
      emailJobMatches?: boolean;
      emailApplicationUpdates?: boolean;
      emailInterviews?: boolean;
      emailMessages?: boolean;
      emailSystem?: boolean;
      pushJobMatches?: boolean;
      pushApplicationUpdates?: boolean;
      pushInterviews?: boolean;
      pushMessages?: boolean;
      pushSystem?: boolean;
      smsJobMatches?: boolean;
      smsApplicationUpdates?: boolean;
      smsInterviews?: boolean;
      smsMessages?: boolean;
      smsSystem?: boolean;
    },
    @Request() req,
  ): Promise<{ message: string }> {
    await this.preferencesService.updatePreferences(req.user.id, preferences);
    return { message: 'Preferences updated successfully' };
  }

  /**
   * Get notification statistics (Admin only)
   */
  @Get('admin/statistics')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get notification statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getNotificationStatistics(): Promise<{
    totalEmails: number;
    emailsToday: number;
    totalReminders: number;
    activeReminders: number;
    emailDeliveryRate: number;
  }> {
    // TODO: Implement statistics
    return {
      totalEmails: 0,
      emailsToday: 0,
      totalReminders: 0,
      activeReminders: 0,
      emailDeliveryRate: 0,
    };
  }
}
