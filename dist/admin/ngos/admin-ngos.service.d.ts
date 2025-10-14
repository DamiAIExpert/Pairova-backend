import { Repository } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { NonprofitOrg } from '../../users/nonprofit/nonprofit.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from '../../jobs/entities/application.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminNgoDto, AdminNgoListDto, NgoJobsListDto, JobApplicantsListDto, NgoStatisticsDto } from './dto/admin-ngo.dto';
import { UpdateNgoDto } from './dto/update-ngo.dto';
export declare class AdminNgosService {
    private readonly userRepository;
    private readonly nonprofitRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    constructor(userRepository: Repository<User>, nonprofitRepository: Repository<NonprofitOrg>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>);
    findAll(paginationDto: PaginationDto, filters?: {
        search?: string;
    }): Promise<AdminNgoListDto>;
    findOne(id: string): Promise<AdminNgoDto>;
    update(id: string, updateNgoDto: UpdateNgoDto): Promise<AdminNgoDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getJobs(id: string, paginationDto: PaginationDto): Promise<NgoJobsListDto>;
    getJobApplicants(ngoId: string, jobId: string, paginationDto: PaginationDto): Promise<JobApplicantsListDto>;
    getStatistics(id: string): Promise<NgoStatisticsDto>;
    private transformUserToNgoDto;
}
