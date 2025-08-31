import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { User } from '../../users/shared/user.entity';
import { Education } from './entities/education.entity';
export declare class EducationController {
    private readonly educationService;
    constructor(educationService: EducationService);
    add(user: User, createEducationDto: CreateEducationDto): Promise<Education>;
    findAll(user: User): Promise<Education[]>;
}
