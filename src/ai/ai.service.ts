import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../jobs/entities/application.entity';
import { ApplicantProfile } from '../users/applicant/applicant.entity';
import { NonprofitOrg } from '../users/nonprofit/nonprofit.entity';
import { Role } from '../common/enums/role.enum';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { ScoreResultDto } from './dto/score-result.dto';
import { JobRecommendationsDto } from './dto/job-recommendations.dto';
import { JobRecommendationDto } from './dto/job-recommendation.dto';
import { MatchInsightsDto } from './dto/match-insights.dto';
import { AiMicroserviceService, JobApplicantData } from './services/ai-microservice.service';
import { PredictionCacheService } from './services/prediction-cache.service';
import { Experience } from '../profiles/experience/entities/experience.entity';
import { Education } from '../profiles/education/entities/education.entity';
import { Certification } from '../profiles/certifications/entities/certification.entity';

/**
 * @class AiService
 * @description Service for AI-powered job matching and recommendations.
 * Integrates with AI microservice for predictions and caches results for performance.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ApplicantProfile)
    private readonly applicantProfileRepository: Repository<ApplicantProfile>,
    @InjectRepository(NonprofitOrg)
    private readonly nonprofitOrgRepository: Repository<NonprofitOrg>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
    private readonly aiMicroserviceService: AiMicroserviceService,
    private readonly predictionCacheService: PredictionCacheService,
  ) {}

  /**
   * Calculate match score between a job and applicant using AI microservice
   */
  async calculateScore(calculateScoreDto: CalculateScoreDto): Promise<ScoreResultDto> {
    const { jobId, applicantId } = calculateScoreDto;

    // Verify job exists
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['postedBy', 'postedBy.nonprofitProfile'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Verify applicant exists
    const applicant = await this.userRepository.findOne({
      where: { id: applicantId, role: Role.APPLICANT },
      relations: ['applicantProfile'],
    });

    if (!applicant || !applicant.applicantProfile) {
      throw new NotFoundException('Applicant not found');
    }

    try {
      // Prepare data for AI microservice
      const jobApplicantData = await this.prepareJobApplicantData(job, applicant);

      // Get prediction from cache or AI microservice
      const prediction = await this.predictionCacheService.getPredictionScore(
        jobId,
        applicantId,
        jobApplicantData,
      );

      // Update application with match score if it exists
      await this.updateApplicationMatchScore(jobId, applicantId, prediction.score);

      return {
        jobId,
        applicantId,
        score: prediction.score,
        breakdown: prediction.scoreDetails || {},
        explanation: (prediction as any).explanation || 'Score calculated based on job-applicant match analysis',
        scoreDetails: prediction.scoreDetails,
        modelVersion: prediction.modelVersion,
        predictionSource: prediction.predictionSource, 
        calculatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error calculating score: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get AI-powered job recommendations for an applicant
   */
  async getRecommendations(
    applicantId: string,
    user: User,
    limit: number = 10,
  ): Promise<JobRecommendationsDto> {
    // Verify user has access to this applicant
    if (user.role !== Role.ADMIN && user.id !== applicantId) {
      throw new Error('Unauthorized access to applicant data');
    }

    const applicant = await this.userRepository.findOne({
      where: { id: applicantId, role: Role.APPLICANT },
      relations: ['applicantProfile'],
    });

    if (!applicant || !applicant.applicantProfile) {
      throw new NotFoundException('Applicant not found');
    }

    try {
      // Get jobs that haven't been applied to
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
        .take(limit * 3); // Get more jobs to filter and rank

      if (appliedJobIds.length > 0) {
        queryBuilder = queryBuilder.andWhere('job.id NOT IN (:...appliedJobIds)', { appliedJobIds });
      }

      const jobs = await queryBuilder.getMany();

      // Prepare batch data for AI microservice
      const jobApplicantPairs = await Promise.all(jobs.map(async job => ({
        jobId: job.id,
        applicantId,
        data: await this.prepareJobApplicantData(job, applicant),
      })));

      // Get predictions from cache or AI microservice
      const predictions = await this.predictionCacheService.getBatchPredictions(jobApplicantPairs);

      // Create recommendations with scores
      const recommendations: JobRecommendationDto[] = predictions.map((prediction, index) => {
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

      // Sort by match score and limit results
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
    } catch (error) {
      this.logger.error(`Error getting recommendations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get match insights for an applicant
   */
  async getMatchInsights(applicantId: string, user: User): Promise<MatchInsightsDto> {
    // Verify user has access to this applicant
    if (user.role !== Role.ADMIN && user.id !== applicantId) {
      throw new Error('Unauthorized access to applicant data');
    }

    const applicant = await this.userRepository.findOne({
      where: { id: applicantId, role: Role.APPLICANT },
      relations: ['applicantProfile'],
    });

    if (!applicant || !applicant.applicantProfile) {
      throw new NotFoundException('Applicant not found');
    }

    try {
      // Get recent applications with scores
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

        // Analyze patterns from applications
        const industries = applications.map(app => app.job.postedBy.nonprofitProfile?.industry).filter(Boolean);
        insights.industryPreferences = [...new Set(industries)];

        const locations = applications.map(app => this.formatLocation(app.job.postedBy.nonprofitProfile)).filter(Boolean);
        insights.locationPreferences = [...new Set(locations)];
      }

      return insights;
    } catch (error) {
      this.logger.error(`Error getting match insights: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get top candidates for a job
   */
  async getTopCandidates(jobId: string, limit: number = 10): Promise<any[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['postedBy', 'postedBy.nonprofitProfile'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    try {
      // Get applications for this job with scores
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
    } catch (error) {
      this.logger.error(`Error getting top candidates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Prepare job and applicant data for AI microservice
   * Respects applicant privacy settings (both main flags and granular categories)
   */
  private async prepareJobApplicantData(job: Job, applicant: User): Promise<JobApplicantData> {
    const applicantProfile = applicant.applicantProfile;
    const nonprofitProfile = job.postedBy.nonprofitProfile;

    // Check main privacy flags
    const allowsAiTraining = applicantProfile?.allowAiTraining ?? true;
    const allowsDataAnalytics = applicantProfile?.allowDataAnalytics ?? true;

    // Check granular privacy category settings
    const allowPersonalInformation = applicantProfile?.allowPersonalInformation ?? true;
    const allowGenderData = applicantProfile?.allowGenderData ?? true;
    const allowLocation = applicantProfile?.allowLocation ?? true;
    const allowExperience = applicantProfile?.allowExperience ?? true;
    const allowSkills = applicantProfile?.allowSkills ?? true;
    const allowCertificates = applicantProfile?.allowCertificates ?? true;
    const allowBio = applicantProfile?.allowBio ?? true;

    // If user doesn't allow AI training or analytics, return minimal data
    if (!allowsAiTraining && !allowsDataAnalytics) {
      this.logger.log(`User ${applicant.id} has disabled AI training and analytics - using minimal data`);
      return this.getMinimalJobApplicantData(job, applicant, nonprofitProfile);
    }

    // Fetch related data based on privacy settings
    const [experiences, educations, certifications] = await Promise.all([
      allowExperience 
        ? this.experienceRepository.find({ where: { userId: applicant.id } })
        : Promise.resolve([]),
      allowExperience // Education is part of experience for matching
        ? this.educationRepository.find({ where: { userId: applicant.id } })
        : Promise.resolve([]),
      allowCertificates
        ? this.certificationRepository.find({ where: { userId: applicant.id } })
        : Promise.resolve([]),
    ]);

    // Prepare job data
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

    // Prepare applicant data respecting granular privacy categories
    const applicantData = {
      id: applicant.id,
      // Skills - only include if allowed
      skills: allowSkills ? (applicantProfile?.skills || []) : [],
      // Experience - only include if allowed
      experience: allowExperience ? experiences.map(exp => {
        // Calculate duration in months
        let duration = 0;
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        } else if (exp.startDate) {
          // If currently working, calculate from start to now
          const start = new Date(exp.startDate);
          const now = new Date();
          duration = Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        }
        return {
          title: exp.roleTitle,
          company: exp.company,
          duration,
          description: exp.description || '',
          skills: [], // Extract skills from description if needed
        };
      }) : [],
      // Education - only include if experience is allowed (education is part of background)
      education: allowExperience ? educations.map(edu => ({
        degree: edu.degree || '',
        field: edu.fieldOfStudy || '',
        institution: edu.school,
        graduationYear: edu.endDate ? new Date(edu.endDate).getFullYear() : new Date().getFullYear(),
      })) : [],
      // Certifications - only include if allowed
      certifications: allowCertificates ? certifications.map(cert => ({
        name: cert.name,
        issuer: cert.issuer || '',
        date: cert.issueDate?.toISOString() || cert.issuedDate?.toISOString() || new Date().toISOString(),
      })) : [],
      // Location - only include if allowed
      location: allowLocation ? {
        country: applicantProfile?.country || 'Unknown',
        state: applicantProfile?.state || 'Unknown',
        city: applicantProfile?.city || 'Unknown',
      } : {
        country: 'Unknown',
        state: 'Unknown',
        city: 'Unknown',
      },
      // Note: personalInfo, gender, and bio are not in the JobApplicantData interface
      // but we can include them as additional fields if the AI microservice supports them
      // For now, we'll keep the interface-compliant structure
      availability: 'IMMEDIATE', // TODO: Add availability to applicant profile
      preferredSalaryRange: undefined, // TODO: Add salary preferences to applicant profile
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

  /**
   * Get minimal job-applicant data when privacy settings are restrictive
   */
  private getMinimalJobApplicantData(job: Job, applicant: User, nonprofitProfile: any): JobApplicantData {
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

  /**
   * Map experience years to experience level
   */
  private mapExperienceLevel(minYrs?: number | null): string {
    if (minYrs == null) return 'MID_LEVEL';
    if (minYrs === 0) return 'ENTRY_LEVEL';
    if (minYrs < 3) return 'ENTRY_LEVEL';
    if (minYrs < 5) return 'MID_LEVEL';
    if (minYrs < 10) return 'SENIOR_LEVEL';
    return 'EXECUTIVE_LEVEL';
  }

  /**
   * Update application match score
   */
  private async updateApplicationMatchScore(jobId: string, applicantId: string, score: number): Promise<void> {
    await this.applicationRepository.update(
      { jobId, applicantId },
      { matchScore: score },
    );
  }

  /**
   * Format location string
   */
  private formatLocation(profile: any): string {
    if (!profile) return 'Unknown';
    
    const parts = [profile.city, profile.state, profile.country].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Get AI microservice health status
   */
  async getAiServiceStatus(): Promise<{ status: string; version: string; model: string; cache: any }> {
    try {
      const aiStatus = await this.aiMicroserviceService.getStatus();
      const cacheStats = await this.predictionCacheService.getPredictionStats();

      return {
        ...aiStatus,
        cache: cacheStats,
      };
    } catch (error) {
      this.logger.error(`Error getting AI service status: ${error.message}`);
      return {
        status: 'unavailable',
        version: 'unknown',
        model: 'unknown',
        cache: { total: 0, active: 0, expired: 0 },
      };
    }
  }

  /**
   * Clean up expired predictions
   */
  async cleanupExpiredPredictions(): Promise<number> {
    return await this.predictionCacheService.cleanupExpiredPredictions();
  }
}
