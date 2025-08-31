import { LandingService } from './landing.service';
import { User } from '../../users/shared/user.entity';
import { UpsertPageDto } from '../pages/dto/upsert-page.dto';
export declare class LandingController {
    private readonly landingService;
    constructor(landingService: LandingService);
    get(): Promise<import("../pages/entities/page.entity").Page>;
    set(dto: UpsertPageDto, admin: User): Promise<import("../pages/entities/page.entity").Page>;
}
