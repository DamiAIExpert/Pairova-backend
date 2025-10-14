import { Repository } from 'typeorm';
import { User } from '../../users/shared/user.entity';
import { ApplicantProfile } from '../../users/applicant/applicant.entity';
import { Application } from '../../jobs/entities/application.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Education } from '../../profiles/education/entities/education.entity';
import { Experience } from '../../profiles/experience/entities/experience.entity';
import { Certification } from '../../profiles/certifications/entities/certification.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AdminJobSeekerDto, AdminJobSeekerListDto, AppliedJobsListDto } from './dto/admin-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
export declare class AdminJobSeekersService {
    private readonly userRepository;
    private readonly applicantRepository;
    private readonly applicationRepository;
    private readonly jobRepository;
    private readonly educationRepository;
    private readonly experienceRepository;
    private readonly certificationRepository;
    constructor(userRepository: Repository<User>, applicantRepository: Repository<ApplicantProfile>, applicationRepository: Repository<Application>, jobRepository: Repository<Job>, educationRepository: Repository<Education>, experienceRepository: Repository<Experience>, certificationRepository: Repository<Certification>);
    findAll(paginationDto: PaginationDto, filters?: {
        search?: string;
    }): Promise<AdminJobSeekerListDto>;
    findOne(id: string): Promise<AdminJobSeekerDto>;
    update(id: string, updateJobSeekerDto: UpdateJobSeekerDto): Promise<AdminJobSeekerDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getAppliedJobs(id: string, paginationDto: PaginationDto): Promise<AppliedJobsListDto>;
    getEducation(id: string): Promise<Education[]>;
    getExperience(id: string): Promise<Experience[]>;
    getCertifications(id: string): Promise<Certification[]>;
    private transformUserToJobSeekerDto;
}
