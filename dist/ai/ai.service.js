"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/shared/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../jobs/entities/application.entity");
const applicant_entity_1 = require("../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../users/nonprofit/nonprofit.entity");
const role_enum_1 = require("../common/enums/role.enum");
const ai_microservice_service_1 = require("./services/ai-microservice.service");
const prediction_cache_service_1 = require("./services/prediction-cache.service");
const experience_entity_1 = require("../profiles/experience/entities/experience.entity");
const education_entity_1 = require("../profiles/education/entities/education.entity");
const certification_entity_1 = require("../profiles/certifications/entities/certification.entity");
let AiService = AiService_1 = class AiService {
    userRepository;
    jobRepository;
    applicationRepository;
    applicantProfileRepository;
    nonprofitOrgRepository;
    experienceRepository;
    educationRepository;
    certificationRepository;
    aiMicroserviceService;
    predictionCacheService;
    logger = new common_1.Logger(AiService_1.name);
    constructor(userRepository, jobRepository, applicationRepository, applicantProfileRepository, nonprofitOrgRepository, experienceRepository, educationRepository, certificationRepository, aiMicroserviceService, predictionCacheService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.applicantProfileRepository = applicantProfileRepository;
        this.nonprofitOrgRepository = nonprofitOrgRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.certificationRepository = certificationRepository;
        this.aiMicroserviceService = aiMicroserviceService;
        this.predictionCacheService = predictionCacheService;
    }
    async calculateScore(calculateScoreDto) {
        const { jobId, applicantId } = calculateScoreDto;
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['postedBy', 'postedBy.nonprofitProfile'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        const applicant = await this.userRepository.findOne({
            where: { id: applicantId, role: role_enum_1.Role.APPLICANT },
            relations: ['applicantProfile'],
        });
        if (!applicant || !applicant.applicantProfile) {
            throw new common_1.NotFoundException('Applicant not found');
        }
        try {
            const jobApplicantData = await this.prepareJobApplicantData(job, applicant);
            const prediction = await this.predictionCacheService.getPredictionScore(jobId, applicantId, jobApplicantData);
            await this.updateApplicationMatchScore(jobId, applicantId, prediction.score);
            return {
                jobId,
                applicantId,
                score: prediction.score,
                breakdown: prediction.scoreDetails || {},
                explanation: prediction.explanation || 'Score calculated based on job-applicant match analysis',
                scoreDetails: prediction.scoreDetails,
                modelVersion: prediction.modelVersion,
                predictionSource: prediction.predictionSource,
                calculatedAt: new Date(),
            };
        }
        catch (error) {
            this.logger.error(`Error calculating score: ${error.message}`);
            throw error;
        }
    }
    async getRecommendations(applicantId, user, limit = 10) {
        if (user.role !== role_enum_1.Role.ADMIN && user.id !== applicantId) {
            throw new Error('Unauthorized access to applicant data');
        }
        const applicant = await this.userRepository.findOne({
            where: { id: applicantId, role: role_enum_1.Role.APPLICANT },
            relations: ['applicantProfile'],
        });
        if (!applicant || !applicant.applicantProfile) {
            throw new common_1.NotFoundException('Applicant not found');
        }
        try {
            const appliedJobIds = await this.applicationRepository
                .createQueryBuilder('application')
                .select('application.jobId')
                .where('application.applicantId = :applicantId', { applicantId })
                .getRawMany()
                .then(results => results.map(r => r.application_jobId));
            let queryBuilder = this.jobRepository
                .createQueryBuilder('job')
                .leftJoinAndSelect('job.postedBy', 'postedBy')
                .leftJoinAndSelect('postedBy.nonprofitProfile', 'nonprofitProfile')
                .where('job.status = :status', { status: 'PUBLISHED' })
                .take(limit * 3);
            if (appliedJobIds.length > 0) {
                queryBuilder = queryBuilder.andWhere('job.id NOT IN (:...appliedJobIds)', { appliedJobIds });
            }
            const jobs = await queryBuilder.getMany();
            const jobApplicantPairs = await Promise.all(jobs.map(async (job) => ({
                jobId: job.id,
                applicantId,
                data: await this.prepareJobApplicantData(job, applicant),
            })));
            const predictions = await this.predictionCacheService.getBatchPredictions(jobApplicantPairs);
            const recommendations = predictions.map((prediction, index) => {
                const job = jobs[index];
                return {
                    jobId: job.id,
                    title: job.title,
                    description: job.description,
                    orgName: job.postedBy.nonprofitProfile?.orgName || 'Unknown Organization',
                    location: this.formatLocation(job.postedBy.nonprofitProfile),
                    employmentType: job.employmentType,
                    placement: job.placement,
                    matchScore: prediction.score,
                    reason: prediction.scoreDetails?.recommendationReason || 'Good match based on your profile',
                    skillGaps: prediction.scoreDetails?.skillGaps || [],
                    strengths: prediction.scoreDetails?.strengths || [],
                    postedAt: job.createdAt,
                };
            });
            recommendations.sort((a, b) => b.matchScore - a.matchScore);
            const topRecommendations = recommendations.slice(0, limit);
            return {
                applicantId,
                recommendations: topRecommendations,
                totalCount: recommendations.length,
                generatedAt: new Date(),
                metadata: {
                    algorithm: 'hybrid',
                    version: '1.0.0',
                    confidence: 0.85,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error getting recommendations: ${error.message}`);
            throw error;
        }
    }
    async getMatchInsights(applicantId, user) {
        if (user.role !== role_enum_1.Role.ADMIN && user.id !== applicantId) {
            throw new Error('Unauthorized access to applicant data');
        }
        const applicant = await this.userRepository.findOne({
            where: { id: applicantId, role: role_enum_1.Role.APPLICANT },
            relations: ['applicantProfile'],
        });
        if (!applicant || !applicant.applicantProfile) {
            throw new common_1.NotFoundException('Applicant not found');
        }
        try {
            const applications = await this.applicationRepository.find({
                where: { applicantId },
                relations: ['job', 'job.postedBy', 'job.postedBy.nonprofitProfile'],
                order: { appliedAt: 'DESC' },
                take: 10,
            });
            const insights = {
                applicantId,
                totalApplications: applications.length,
                totalJobsAnalyzed: applications.length,
                averageMatchScore: 0,
                topSkills: [],
                skillGaps: [],
                topIndustries: [],
                industryPreferences: [],
                locationPreferences: [],
                salaryExpectations: null,
                skillsAnalysis: {
                    strengths: [],
                    weaknesses: [],
                    recommendations: [],
                },
                locationInsights: {
                    preferredCities: [],
                    remoteWorkPreference: 0.5,
                },
                marketTrends: {
                    inDemandSkills: [],
                    averageSalary: null,
                    jobGrowth: null,
                },
                improvementSuggestions: [],
                generatedAt: new Date(),
            };
            if (applications.length > 0) {
                const scores = applications.filter(app => app.matchScore !== null).map(app => app.matchScore);
                insights.averageMatchScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                const industries = applications.map(app => app.job.postedBy.nonprofitProfile?.industry).filter(Boolean);
                insights.industryPreferences = [...new Set(industries)];
                const locations = applications.map(app => this.formatLocation(app.job.postedBy.nonprofitProfile)).filter(Boolean);
                insights.locationPreferences = [...new Set(locations)];
            }
            return insights;
        }
        catch (error) {
            this.logger.error(`Error getting match insights: ${error.message}`);
            throw error;
        }
    }
    async getTopCandidates(jobId, limit = 10) {
        const job = await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ['postedBy', 'postedBy.nonprofitProfile'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        try {
            const applications = await this.applicationRepository.find({
                where: { jobId },
                relations: ['applicant', 'applicant.applicantProfile'],
                order: { matchScore: 'DESC' },
                take: limit,
            });
            return applications.map(app => ({
                applicantId: app.applicantId,
                name: `${app.applicant.applicantProfile?.firstName} ${app.applicant.applicantProfile?.lastName}`,
                email: app.applicant.email,
                matchScore: app.matchScore,
                status: app.status,
                appliedAt: app.appliedAt,
            }));
        }
        catch (error) {
            this.logger.error(`Error getting top candidates: ${error.message}`);
            throw error;
        }
    }
    async prepareJobApplicantData(job, applicant) {
        const applicantProfile = applicant.applicantProfile;
        const nonprofitProfile = job.postedBy.nonprofitProfile;
        const allowsAiTraining = applicantProfile?.allowAiTraining ?? true;
        const allowsDataAnalytics = applicantProfile?.allowDataAnalytics ?? true;
        const allowPersonalInformation = applicantProfile?.allowPersonalInformation ?? true;
        const allowGenderData = applicantProfile?.allowGenderData ?? true;
        const allowLocation = applicantProfile?.allowLocation ?? true;
        const allowExperience = applicantProfile?.allowExperience ?? true;
        const allowSkills = applicantProfile?.allowSkills ?? true;
        const allowCertificates = applicantProfile?.allowCertificates ?? true;
        const allowBio = applicantProfile?.allowBio ?? true;
        if (!allowsAiTraining && !allowsDataAnalytics) {
            this.logger.log(`User ${applicant.id} has disabled AI training and analytics - using minimal data`);
            return this.getMinimalJobApplicantData(job, applicant, nonprofitProfile);
        }
        const [experiences, educations, certifications] = await Promise.all([
            allowExperience
                ? this.experienceRepository.find({ where: { userId: applicant.id } })
                : Promise.resolve([]),
            allowExperience
                ? this.educationRepository.find({ where: { userId: applicant.id } })
                : Promise.resolve([]),
            allowCertificates
                ? this.certificationRepository.find({ where: { userId: applicant.id } })
                : Promise.resolve([]),
        ]);
        const jobData = {
            id: job.id,
            title: job.title,
            description: job.description,
            requirements: job.requiredSkills || [],
            skills: job.requiredSkills || [],
            experienceLevel: this.mapExperienceLevel(job.experienceMinYrs),
            employmentType: job.employmentType,
            placement: job.placement,
            salaryRange: job.salaryMin && job.salaryMax ? {
                min: job.salaryMin,
                max: job.salaryMax,
                currency: job.currency || 'USD',
            } : undefined,
            location: {
                country: nonprofitProfile?.country || 'Unknown',
                state: nonprofitProfile?.state || 'Unknown',
                city: nonprofitProfile?.city || 'Unknown',
            },
            industry: nonprofitProfile?.industry || 'Unknown',
            orgSize: nonprofitProfile?.sizeLabel || 'Unknown',
            orgType: nonprofitProfile?.orgType || 'Unknown',
        };
        const applicantData = {
            id: applicant.id,
            skills: allowSkills ? (applicantProfile?.skills || []) : [],
            experience: allowExperience ? experiences.map(exp => {
                let duration = 0;
                if (exp.startDate && exp.endDate) {
                    const start = new Date(exp.startDate);
                    const end = new Date(exp.endDate);
                    duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                }
                else if (exp.startDate) {
                    const start = new Date(exp.startDate);
                    const now = new Date();
                    duration = Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
                }
                return {
                    title: exp.roleTitle,
                    company: exp.company,
                    duration,
                    description: exp.description || '',
                    skills: [],
                };
            }) : [],
            education: allowExperience ? educations.map(edu => ({
                degree: edu.degree || '',
                field: edu.fieldOfStudy || '',
                institution: edu.school,
                graduationYear: edu.endDate ? new Date(edu.endDate).getFullYear() : new Date().getFullYear(),
            })) : [],
            certifications: allowCertificates ? certifications.map(cert => ({
                name: cert.name,
                issuer: cert.issuer || '',
                date: cert.issueDate?.toISOString() || cert.issuedDate?.toISOString() || new Date().toISOString(),
            })) : [],
            location: allowLocation ? {
                country: applicantProfile?.country || 'Unknown',
                state: applicantProfile?.state || 'Unknown',
                city: applicantProfile?.city || 'Unknown',
            } : {
                country: 'Unknown',
                state: 'Unknown',
                city: 'Unknown',
            },
            availability: 'IMMEDIATE',
            preferredSalaryRange: undefined,
            workPreferences: {
                employmentTypes: applicantProfile?.preferredEmploymentType
                    ? [applicantProfile.preferredEmploymentType]
                    : [job.employmentType],
                placements: [job.placement],
                industries: [nonprofitProfile?.industry || 'Unknown'],
            },
        };
        return {
            job: jobData,
            applicant: applicantData,
        };
    }
    getMinimalJobApplicantData(job, applicant, nonprofitProfile) {
        return {
            job: {
                id: job.id,
                title: job.title,
                description: job.description,
                requirements: [],
                skills: [],
                experienceLevel: 'MID_LEVEL',
                employmentType: job.employmentType,
                placement: job.placement,
                salaryRange: undefined,
                location: {
                    country: nonprofitProfile?.country || 'Unknown',
                    state: nonprofitProfile?.state || 'Unknown',
                    city: nonprofitProfile?.city || 'Unknown',
                },
                industry: nonprofitProfile?.industry || 'Unknown',
                orgSize: nonprofitProfile?.sizeLabel || 'Unknown',
                orgType: nonprofitProfile?.orgType || 'Unknown',
            },
            applicant: {
                id: applicant.id,
                skills: [],
                experience: [],
                education: [],
                certifications: [],
                location: {
                    country: 'Unknown',
                    state: 'Unknown',
                    city: 'Unknown',
                },
                availability: 'IMMEDIATE',
                preferredSalaryRange: undefined,
                workPreferences: {
                    employmentTypes: [job.employmentType],
                    placements: [job.placement],
                    industries: [],
                },
            },
        };
    }
    mapExperienceLevel(minYrs) {
        if (minYrs == null)
            return 'MID_LEVEL';
        if (minYrs === 0)
            return 'ENTRY_LEVEL';
        if (minYrs < 3)
            return 'ENTRY_LEVEL';
        if (minYrs < 5)
            return 'MID_LEVEL';
        if (minYrs < 10)
            return 'SENIOR_LEVEL';
        return 'EXECUTIVE_LEVEL';
    }
    async updateApplicationMatchScore(jobId, applicantId, score) {
        await this.applicationRepository.update({ jobId, applicantId }, { matchScore: score });
    }
    formatLocation(profile) {
        if (!profile)
            return 'Unknown';
        const parts = [profile.city, profile.state, profile.country].filter(Boolean);
        return parts.join(', ');
    }
    async getAiServiceStatus() {
        try {
            const aiStatus = await this.aiMicroserviceService.getStatus();
            const cacheStats = await this.predictionCacheService.getPredictionStats();
            return {
                ...aiStatus,
                cache: cacheStats,
            };
        }
        catch (error) {
            this.logger.error(`Error getting AI service status: ${error.message}`);
            return {
                status: 'unavailable',
                version: 'unknown',
                model: 'unknown',
                cache: { total: 0, active: 0, expired: 0 },
            };
        }
    }
    async cleanupExpiredPredictions() {
        return await this.predictionCacheService.cleanupExpiredPredictions();
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(applicant_entity_1.ApplicantProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(nonprofit_entity_1.NonprofitOrg)),
    __param(5, (0, typeorm_1.InjectRepository)(experience_entity_1.Experience)),
    __param(6, (0, typeorm_1.InjectRepository)(education_entity_1.Education)),
    __param(7, (0, typeorm_1.InjectRepository)(certification_entity_1.Certification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ai_microservice_service_1.AiMicroserviceService,
        prediction_cache_service_1.PredictionCacheService])
], AiService);
//# sourceMappingURL=ai.service.js.map