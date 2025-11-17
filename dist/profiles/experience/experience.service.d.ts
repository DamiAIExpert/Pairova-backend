import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { User } from '../../users/shared/user.entity';
export declare class ExperienceService {
    private readonly experienceRepository;
    constructor(experienceRepository: Repository<Experience>);
    addExperience(user: User, createExperienceDto: CreateExperienceDto): Promise<Experience>;
    findByUserId(userId: string): Promise<Experience[]>;
    findOneById(id: string): Promise<Experience>;
    remove(id: string): Promise<void>;
}
