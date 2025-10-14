export declare class DashboardStatsDto {
    totalUsers: number;
    totalApplicants: number;
    totalNonprofits: number;
    totalJobs: number;
    totalApplications: number;
    activeJobs: number;
    verifiedUsers: number;
    applicationsThisMonth: number;
    newUsersThisMonth: number;
    hiringRate: number;
    averageApplicationsPerJob: number;
}
export declare class PerformanceDataPoint {
    date: string;
    value: number;
}
export declare class PerformanceMetricsDto {
    userRegistrations: PerformanceDataPoint[];
    jobPostings: PerformanceDataPoint[];
    applications: PerformanceDataPoint[];
    successfulMatches: PerformanceDataPoint[];
    period: string;
}
export declare class ActivityItem {
    id: string;
    type: 'USER_REGISTERED' | 'JOB_POSTED' | 'APPLICATION_SUBMITTED' | 'USER_VERIFIED' | 'JOB_PUBLISHED';
    description: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    entityId?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export declare class ActivityFeedDto {
    activities: ActivityItem[];
    total: number;
}
export declare class RecommendationDto {
    id: string;
    type: 'HIGH_MATCH_SCORE' | 'PENDING_REVIEW' | 'ACTIVE_APPLICANTS' | 'JOB_RECOMMENDATION';
    title: string;
    description: string;
    priority: number;
    entityIds?: string[];
    actionUrl?: string;
    createdAt: Date;
}
export declare class RecommendationsDto {
    recommendations: RecommendationDto[];
    highPriorityCount: number;
}
