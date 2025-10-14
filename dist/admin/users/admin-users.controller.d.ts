import { AdminUsersService } from './admin-users.service';
import { Role } from '../../common/enums/role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminUserDto, AdminUserListDto } from './dto/admin-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
export declare class AdminUsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    findAll(paginationDto: PaginationDto, role?: Role, search?: string): Promise<AdminUserListDto>;
    findOne(id: string): Promise<AdminUserDto>;
    update(id: string, updateUserStatusDto: UpdateUserStatusDto): Promise<AdminUserDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getUserApplications(id: string, paginationDto: PaginationDto): Promise<{
        data: import("../../jobs/entities/application.entity").Application[];
        total: number;
        page: number;
        limit: number;
    }>;
}
