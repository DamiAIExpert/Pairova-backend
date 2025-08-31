import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByIdWithProfile(id: string): Promise<User>;
    findOneById(id: string): Promise<User | undefined>;
    findByEmailWithPassword(email: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(userDto: Partial<User>): Promise<User>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    all(): Promise<User[]>;
}
