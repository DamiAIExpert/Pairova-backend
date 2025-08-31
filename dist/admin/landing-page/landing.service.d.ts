import { Repository } from 'typeorm';
import { Page } from '../pages/entities/page.entity';
import { UpsertPageDto } from '../pages/dto/upsert-page.dto';
import { User } from '../../users/shared/user.entity';
export declare class LandingService {
    private readonly pageRepository;
    private readonly landingPageSlug;
    constructor(pageRepository: Repository<Page>);
    get(): Promise<Page>;
    set(dto: UpsertPageDto, admin: User): Promise<Page>;
}
