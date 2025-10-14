import { Repository } from 'typeorm';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminApplicationDto, AdminApplicationListDto, UpdateApplicationStatusDto, ApplicationPipelineDto, ApplicationStatisticsDto } from './dto/admin-application.dto';
export declare class AdminApplicationsService {
    private readonly applicationRepository;
    private readonly jobRepository;
    private readonly userRepository;
    private readonly applicantRepository;
    private readonly nonprofitRepository;
    constructor(applicationRepository: Repository<Application>, jobRepository: Repository<Job>, userRepository: Repository<User>, applicantRepository: Repository<ApplicantProfile>, nonprofitRepository: Repository<NonprofitOrg>);
    findAll(paginationDto: PaginationDto, filters?: {
        status?: string;
        jobId?: string;
        applicantId?: string;
        ngoId?: string;
        search?: string;
    }): Promise<AdminApplicationListDto>;
    findOne(id: string): Promise<AdminApplicationDto>;
    updateStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<AdminApplicationDto>;
    getPipeline(ngoId?: string): Promise<ApplicationPipelineDto>;
    getStatistics(ngoId?: string): Promise<ApplicationStatisticsDto>;
    private transformToDto;
}
