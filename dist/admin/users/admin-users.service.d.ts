import { Repository } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminUserDto, AdminUserListDto } from './dto/admin-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { Role } from '../../common/enums/role.enum';
export declare class AdminUsersService {
    private readonly userRepository;
    private readonly applicantRepository;
    private readonly nonprofitRepository;
    private readonly applicationRepository;
    private readonly jobRepository;
    constructor(userRepository: Repository<User>, applicantRepository: Repository<ApplicantProfile>, nonprofitRepository: Repository<NonprofitOrg>, applicationRepository: Repository<Application>, jobRepository: Repository<Job>);
    findAll(paginationDto: PaginationDto, filters?: {
        role?: Role;
        search?: string;
    }): Promise<AdminUserListDto>;
    findOne(id: string): Promise<AdminUserDto>;
    update(id: string, updateUserStatusDto: UpdateUserStatusDto): Promise<AdminUserDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getUserApplications(id: string, paginationDto: PaginationDto): Promise<{
        data: Application[];
        total: number;
        page: number;
        limit: number;
    }>;
    private transformUserToAdminDto;
}
