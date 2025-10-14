import { Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { DashboardStatsDto, PerformanceMetricsDto, ActivityFeedDto, RecommendationsDto } from './dto/dashboard.dto';
export declare class AdminService {
    private readonly userRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>);
    getDashboardStats(): Promise<DashboardStatsDto>;
    getPerformanceMetrics(period: string): Promise<PerformanceMetricsDto>;
    getActivityFeed(limit: number): Promise<ActivityFeedDto>;
    getRecommendations(): Promise<RecommendationsDto>;
    private parsePeriod;
    private generateDatePoints;
}
