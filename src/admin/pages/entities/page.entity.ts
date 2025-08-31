// src/admin/pages/entities/page.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PageType } from '../../../common/enums/page-type.enum';

/**
 * @class Page
 * @description Represents a manageable content page in the CMS, like the landing page or about page.
 */
@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120, unique: true })
  slug: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'enum', enum: PageType, default: PageType.CUSTOM })
  type: PageType;

  @Column('jsonb', { comment: 'Stores rich content blocks for the page' })
  content: Record<string, any>;

  @Column({ name: 'hero_image_url', type: 'text', nullable: true })
  heroImageUrl: string;

  @Column({ name: 'last_published_at', type: 'timestamptz', nullable: true })
  lastPublishedAt: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
