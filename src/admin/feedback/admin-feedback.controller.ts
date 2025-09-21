// src/admin/feedback/admin-feedback.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminFeedbackService } from './admin-feedback.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { 
  FeedbackDto, 
  FeedbackListDto, 
  CreateFeedbackDto, 
  UpdateFeedbackDto 
} from './dto/feedback.dto';

/**
 * @class AdminFeedbackController
 * @description Provides admin endpoints for managing user feedback.
 */
@ApiTags('Admin - Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/feedback')
export class AdminFeedbackController {
  constructor(private readonly adminFeedbackService: AdminFeedbackService) {}

  /**
   * @route GET /admin/feedback
   * @description Get paginated list of all feedback with filtering options.
   */
  @Get()
  @ApiOperation({ summary: 'Get paginated list of all feedback' })
  @ApiResponse({ status: 200, description: 'List of feedback retrieved successfully.', type: FeedbackListDto })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.adminFeedbackService.findAll(paginationDto, { status, priority, category, search });
  }

  /**
   * @route GET /admin/feedback/:id
   * @description Get detailed information about a specific feedback item.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get feedback details by ID' })
  @ApiResponse({ status: 200, description: 'Feedback details retrieved successfully.', type: FeedbackDto })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminFeedbackService.findOne(id);
  }

  /**
   * @route PUT /admin/feedback/:id
   * @description Update feedback status, priority, or admin notes.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update feedback item' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully.', type: FeedbackDto })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.adminFeedbackService.update(id, updateFeedbackDto);
  }

  /**
   * @route DELETE /admin/feedback/:id
   * @description Delete a feedback item.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback item' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminFeedbackService.remove(id);
  }

  /**
   * @route GET /admin/feedback/statistics
   * @description Get feedback statistics and metrics.
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get feedback statistics' })
  @ApiResponse({ status: 200, description: 'Feedback statistics retrieved successfully.' })
  getStatistics() {
    return this.adminFeedbackService.getStatistics();
  }
}

/**
 * @class PublicFeedbackController
 * @description Provides public endpoints for users to submit feedback.
 */
@ApiTags('Public - Feedback')
@Controller('feedback')
export class PublicFeedbackController {
  constructor(private readonly adminFeedbackService: AdminFeedbackService) {}

  /**
   * @route POST /feedback
   * @description Submit new feedback (public endpoint).
   */
  @Post()
  @ApiOperation({ summary: 'Submit new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback submitted successfully.', type: FeedbackDto })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.adminFeedbackService.create(createFeedbackDto);
  }
}
