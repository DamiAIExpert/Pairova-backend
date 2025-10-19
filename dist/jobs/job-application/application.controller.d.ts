import { ApplicationsService } from './application.service';
import { User } from '../../users/shared/user.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationStatusDto } from '../dto/update-application-status.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    apply(createApplicationDto: CreateApplicationDto, user: User): Promise<import("../entities/application.entity").Application>;
    findAllForCurrentUser(user: User): Promise<import("../entities/application.entity").Application[]>;
    findOne(id: string, user: User): Promise<import("../entities/application.entity").Application>;
    updateStatus(id: string, updateStatusDto: UpdateApplicationStatusDto, user: User): Promise<import("../entities/application.entity").Application>;
}
