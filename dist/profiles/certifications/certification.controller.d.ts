import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { User } from '../../users/shared/user.entity';
import { Certification } from './entities/certification.entity';
export declare class CertificationController {
    private readonly certificationService;
    constructor(certificationService: CertificationService);
    add(user: User, createCertificationDto: CreateCertificationDto): Promise<Certification>;
    findAll(user: User): Promise<Certification[]>;
    remove(id: string, user: User): Promise<void>;
}
