import { AdminApplicationsService } from './admin-applications.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminApplicationDto, AdminApplicationListDto, UpdateApplicationStatusDto, ApplicationPipelineDto } from './dto/admin-application.dto';
export declare class AdminApplicationsController {
    private readonly adminApplicationsService;
    constructor(adminApplicationsService: AdminApplicationsService);
    findAll(paginationDto: PaginationDto, status?: string, jobId?: string, applicantId?: string, ngoId?: string, search?: string): Promise<AdminApplicationListDto>;
    findOne(id: string): Promise<AdminApplicationDto>;
    updateStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<AdminApplicationDto>;
    getPipeline(ngoId?: string): Promise<ApplicationPipelineDto>;
    getStatistics(ngoId?: string): Promise<import("./dto/admin-application.dto").ApplicationStatisticsDto>;
}
