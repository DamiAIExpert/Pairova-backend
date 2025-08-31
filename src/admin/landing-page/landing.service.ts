// src/admin/landing-page/landing.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../pages/entities/page.entity';
import { PageType } from '../../common/enums/page-type.enum';
import { UpsertPageDto } from '../pages/dto/upsert-page.dto';
import { User } from '../../users/shared/user.entity';

/**
 * @class LandingService
 * @description A specialized service that acts as a proxy to the PagesService,
 * specifically for managing the single landing page record.
 */
@Injectable()
export class LandingService {
  private readonly landingPageSlug = 'landing';

  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  /**
   * Retrieves the content of the landing page.
   * @returns {Promise<Page>} The landing page entity.
   */
  async get(): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { slug: this.landingPageSlug } });
    if (!page) {
      // Create a default if it doesn't exist
      return this.pageRepository.save({
        slug: this.landingPageSlug,
        title: 'Welcome to Pairova',
        type: PageType.LANDING,
        content: { hero: { title: 'Default Title' }, sections: [] },
      });
    }
    return page;
  }

  /**
   * Updates the content of the landing page.
   * @param dto - The DTO containing the new content for the landing page.
   * @param admin - The admin user performing the update.
   * @returns {Promise<Page>} The updated landing page entity.
   */
  async set(dto: UpsertPageDto, admin: User): Promise<Page> {
    const page = await this.get(); // Ensures the page exists
    const updatedPage = this.pageRepository.merge(page, dto, { updatedBy: admin.id, type: PageType.LANDING });
    return this.pageRepository.save(updatedPage);
  }
}
