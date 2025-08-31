import { PagesService } from './pages.service';
import { User } from '../../users/shared/user.entity';
import { Page } from './entities/page.entity';
import { UpsertPageDto } from './dto/upsert-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    get(slug: string): Promise<Page>;
    upsert(slug: string, upsertPageDto: UpsertPageDto, adminUser: User): Promise<Page>;
}
