import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { User } from '../../users/shared/user.entity';
import { Experience } from './entities/experience.entity';
export declare class ExperienceController {
    private readonly experienceService;
    constructor(experienceService: ExperienceService);
    add(user: User, createExperienceDto: CreateExperienceDto): Promise<Experience>;
    findAll(user: User): Promise<Experience[]>;
}
