import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export interface AiMicroserviceConfig {
    baseUrl: string;
    apiKey: string;
    timeout: number;
    retryAttempts: number;
}
export interface JobApplicantData {
    job: {
        id: string;
        title: string;
        description: string;
        requirements: string[];
        skills: string[];
        experienceLevel: string;
        employmentType: string;
        placement: string;
        salaryRange?: {
            min: number;
            max: number;
            currency: string;
        };
        location: {
            country: string;
            state: string;
            city: string;
        };
        industry: string;
        orgSize: string;
        orgType: string;
    };
    applicant: {
        id: string;
        skills: string[];
        experience: Array<{
            title: string;
            company: string;
            duration: number;
            description: string;
            skills: string[];
        }>;
        education: Array<{
            degree: string;
            field: string;
            institution: string;
            graduationYear: number;
        }>;
        certifications: Array<{
            name: string;
            issuer: string;
            date: string;
        }>;
        location: {
            country: string;
            state: string;
            city: string;
        };
        availability: string;
        preferredSalaryRange?: {
            min: number;
            max: number;
            currency: string;
        };
        workPreferences: {
            employmentTypes: string[];
            placements: string[];
            industries: string[];
        };
    };
}
export interface AiPredictionResponse {
    score: number;
    scoreDetails: {
        skillMatch: number;
        experienceMatch: number;
        locationMatch: number;
        salaryMatch: number;
        industryMatch: number;
        educationMatch: number;
        cultureMatch: number;
        availabilityMatch: number;
        recommendationReason: string;
        skillGaps: string[];
        strengths: string[];
        improvements: string[];
    };
    modelVersion: string;
    predictionId: string;
    confidence: number;
    processingTime: number;
}
export declare class AiMicroserviceService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly config;
    constructor(httpService: HttpService, configService: ConfigService);
    getPredictionScore(jobApplicantData: JobApplicantData): Promise<AiPredictionResponse>;
    getBatchPredictions(jobApplicantPairs: JobApplicantData[]): Promise<AiPredictionResponse[]>;
    getRecommendations(applicantData: JobApplicantData['applicant'], limit?: number): Promise<AiPredictionResponse[]>;
    isHealthy(): Promise<boolean>;
    getStatus(): Promise<{
        status: string;
        version: string;
        model: string;
    }>;
}
