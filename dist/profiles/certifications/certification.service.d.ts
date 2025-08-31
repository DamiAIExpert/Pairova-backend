import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { User } from '../../users/shared/user.entity';
export declare class CertificationService {
    private readonly certificationRepository;
    constructor(certificationRepository: Repository<Certification>);
    add(user: User, createCertificationDto: CreateCertificationDto): Promise<Certification>;
    findAllByUserId(userId: string): Promise<Certification[]>;
    findOneById(id: string): Promise<Certification>;
    remove(id: string): Promise<void>;
}
