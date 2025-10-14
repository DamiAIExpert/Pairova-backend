import { AdminJobSeekersService } from './admin-job-seekers.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminJobSeekerDto, AdminJobSeekerListDto } from './dto/admin-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
export declare class AdminJobSeekersController {
    private readonly adminJobSeekersService;
    constructor(adminJobSeekersService: AdminJobSeekersService);
    findAll(paginationDto: PaginationDto, search?: string): Promise<AdminJobSeekerListDto>;
    findOne(id: string): Promise<AdminJobSeekerDto>;
    update(id: string, updateJobSeekerDto: UpdateJobSeekerDto): Promise<AdminJobSeekerDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getAppliedJobs(id: string, paginationDto: PaginationDto): Promise<import("./dto/admin-job-seeker.dto").AppliedJobsListDto>;
    getEducation(id: string): Promise<import("../../profiles/education/entities/education.entity").Education[]>;
    getExperience(id: string): Promise<import("../../profiles/experience/entities/experience.entity").Experience[]>;
    getCertifications(id: string): Promise<import("../../profiles/certifications/entities/certification.entity").Certification[]>;
}
