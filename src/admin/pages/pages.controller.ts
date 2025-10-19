// src/admin/pages/pages.controller.ts
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { Page } from './entities/page.entity';
import { UpsertPageDto } from './dto/upsert-page.dto';

/**
 * @class PagesController
 * @description Provides admin endpoints for managing CMS pages.
 */
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /**
   * @route GET /admin/pages/:slug
   * @description Retrieves the content of a specific CMS page.
   * @param {string} slug - The unique slug of the page.
   * @returns {Promise<Page>} The page data.
   */
  @Get(':slug')
  @ApiOperation({ summary: 'Get a CMS page by its slug' })
  @ApiResponse({ status: 200, description: 'The page content and metadata.', type: Page })
  get(@Param('slug') slug: string): Promise<Page> {
    return this.pagesService.findBySlug(slug);
  }

  /**
   * @route PUT /admin/pages/:slug
   * @description Creates or updates a CMS page.
   * @param {string} slug - The unique slug for the page.
   * @param {UpsertPageDto} upsertPageDto - The content and metadata for the page.
   * @param {User} adminUser - The authenticated admin user.
   * @returns {Promise<Page>} The updated page data.
   */
  @Put(':slug')
  @ApiOperation({ summary: 'Create or update a CMS page' })
  @ApiResponse({ status: 200, description: 'The created or updated page.', type: Page })
  upsert(
    @Param('slug') slug: string,
    @Body() upsertPageDto: UpsertPageDto,
    @CurrentUser() adminUser: User,
  ): Promise<Page> {
    return this.pagesService.upsert(slug, upsertPageDto, adminUser);
  }
}
