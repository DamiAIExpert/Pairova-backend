import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { User } from '../../users/shared/user.entity';
export declare class EducationService {
    private readonly educationRepository;
    constructor(educationRepository: Repository<Education>);
    addEducation(user: User, createEducationDto: CreateEducationDto): Promise<Education>;
    findByUserId(userId: string): Promise<Education[]>;
}
