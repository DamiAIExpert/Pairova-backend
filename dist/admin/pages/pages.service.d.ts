import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { UpsertPageDto } from './dto/upsert-page.dto';
import { User } from '../../users/shared/user.entity';
export declare class PagesService {
    private readonly pageRepository;
    constructor(pageRepository: Repository<Page>);
    findBySlug(slug: string): Promise<Page>;
    upsert(slug: string, upsertPageDto: UpsertPageDto, adminUser: User): Promise<Page>;
}
