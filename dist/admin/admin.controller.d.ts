import { AdminService } from './admin.service';
import { DashboardStatsDto, PerformanceMetricsDto, ActivityFeedDto } from './dto/dashboard.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<DashboardStatsDto>;
    getPerformanceMetrics(period?: string): Promise<PerformanceMetricsDto>;
    getActivityFeed(limit?: number): Promise<ActivityFeedDto>;
    getRecommendations(): Promise<import("./dto/dashboard.dto").RecommendationsDto>;
}
