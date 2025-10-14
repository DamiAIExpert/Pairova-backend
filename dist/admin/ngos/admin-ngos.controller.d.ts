import { AdminNgosService } from './admin-ngos.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminNgoDto, AdminNgoListDto } from './dto/admin-ngo.dto';
import { UpdateNgoDto } from './dto/update-ngo.dto';
export declare class AdminNgosController {
    private readonly adminNgosService;
    constructor(adminNgosService: AdminNgosService);
    findAll(paginationDto: PaginationDto, search?: string): Promise<AdminNgoListDto>;
    findOne(id: string): Promise<AdminNgoDto>;
    update(id: string, updateNgoDto: UpdateNgoDto): Promise<AdminNgoDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getJobs(id: string, paginationDto: PaginationDto): Promise<import("./dto/admin-ngo.dto").NgoJobsListDto>;
    getJobApplicants(ngoId: string, jobId: string, paginationDto: PaginationDto): Promise<import("./dto/admin-ngo.dto").JobApplicantsListDto>;
    getStatistics(id: string): Promise<import("./dto/admin-ngo.dto").NgoStatisticsDto>;
}
