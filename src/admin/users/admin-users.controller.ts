// src/admin/users/admin-users.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminUserDto, AdminUserListDto } from './dto/admin-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

/**
 * @class AdminUsersController
 * @description Provides admin endpoints for managing all users (applicants and nonprofits).
 */
@ApiTags('Admin - User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  /**
   * @route GET /admin/users
   * @description Get paginated list of all users with filtering options.
   */
  @Get()
  @ApiOperation({ summary: 'Get paginated list of all users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.', type: AdminUserListDto })
  findAll(@Query() paginationDto: PaginationDto, @Query('role') role?: Role, @Query('search') search?: string) {
    return this.adminUsersService.findAll(paginationDto, { role, search });
  }

  /**
   * @route GET /admin/users/:id
   * @description Get detailed information about a specific user.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully.', type: AdminUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUsersService.findOne(id);
  }

  /**
   * @route PUT /admin/users/:id
   * @description Update user profile information.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: AdminUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
    return this.adminUsersService.update(id, updateUserStatusDto);
  }

  /**
   * @route DELETE /admin/users/:id
   * @description Delete or suspend a user account.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete or suspend user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUsersService.remove(id);
  }

  /**
   * @route GET /admin/users/:id/applications
   * @description Get all applications for a specific user.
   */
  @Get(':id/applications')
  @ApiOperation({ summary: 'Get user applications' })
  @ApiResponse({ status: 200, description: 'User applications retrieved successfully.' })
  getUserApplications(@Param('id', ParseUUIDPipe) id: string, @Query() paginationDto: PaginationDto) {
    return this.adminUsersService.getUserApplications(id, paginationDto);
  }
}
