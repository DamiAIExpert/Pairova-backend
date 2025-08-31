// src/admin/pages/pages.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { UpsertPageDto } from './dto/upsert-page.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class PagesService
 * @description Handles business logic for the content management system (CMS) pages.
 */
@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  /**
   * Retrieves a page by its unique slug.
   * @param slug - The URL-friendly slug of the page.
   * @returns {Promise<Page>} The found page entity.
   * @throws {NotFoundException} If no page is found with the given slug.
   */
  async findBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { slug } });
    if (!page) {
      throw new NotFoundException(`Page with slug "${slug}" not found.`);
    }
    return page;
  }

  /**
   * Creates or updates a page based on its slug.
   * @param slug - The slug of the page to create or update.
   * @param upsertPageDto - The DTO with the page's content and metadata.
   * @param adminUser - The administrator performing the action.
   * @returns {Promise<Page>} The created or updated page entity.
   */
  async upsert(slug: string, upsertPageDto: UpsertPageDto, adminUser: User): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { slug } });

    if (page) {
      // Update existing page
      const updatedPage = this.pageRepository.merge(page, upsertPageDto, { updatedBy: adminUser.id });
      return this.pageRepository.save(updatedPage);
    } else {
      // Create new page
      const newPage = this.pageRepository.create({
        ...upsertPageDto,
        slug,
        updatedBy: adminUser.id,
      });
      return this.pageRepository.save(newPage);
    }
  }
}
