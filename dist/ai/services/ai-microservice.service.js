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
var AiMicroserviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMicroserviceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AiMicroserviceService = AiMicroserviceService_1 = class AiMicroserviceService {
    httpService;
    configService;
    logger = new common_1.Logger(AiMicroserviceService_1.name);
    config;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.config = {
            baseUrl: this.configService.get('AI_MICROSERVICE_URL', 'http://localhost:8000'),
            apiKey: this.configService.get('AI_MICROSERVICE_API_KEY', ''),
            timeout: this.configService.get('AI_MICROSERVICE_TIMEOUT', 30000),
            retryAttempts: this.configService.get('AI_MICROSERVICE_RETRY_ATTEMPTS', 3),
        };
    }
    async getPredictionScore(jobApplicantData) {
        try {
            this.logger.log(`Requesting prediction for job ${jobApplicantData.job.id} and applicant ${jobApplicantData.applicant.id}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/api/v1/predictions/score`, jobApplicantData, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: this.config.timeout,
            }));
            if (response.status !== 200) {
                throw new common_1.HttpException('AI microservice returned non-200 status', common_1.HttpStatus.BAD_GATEWAY);
            }
            const prediction = response.data;
            this.logger.log(`Received prediction score: ${prediction.score} for job ${jobApplicantData.job.id}`);
            return prediction;
        }
        catch (error) {
            this.logger.error(`Error getting prediction from AI microservice: ${error.message}`);
            if (error.response) {
                throw new common_1.HttpException(`AI microservice error: ${error.response.data?.message || error.message}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            throw new common_1.HttpException('Failed to communicate with AI microservice', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async getBatchPredictions(jobApplicantPairs) {
        try {
            this.logger.log(`Requesting batch predictions for ${jobApplicantPairs.length} pairs`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/api/v1/predictions/batch-score`, { predictions: jobApplicantPairs }, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: this.config.timeout * 2,
            }));
            if (response.status !== 200) {
                throw new common_1.HttpException('AI microservice returned non-200 status for batch request', common_1.HttpStatus.BAD_GATEWAY);
            }
            const predictions = response.data.predictions;
            this.logger.log(`Received ${predictions.length} batch predictions`);
            return predictions;
        }
        catch (error) {
            this.logger.error(`Error getting batch predictions from AI microservice: ${error.message}`);
            if (error.response) {
                throw new common_1.HttpException(`AI microservice batch error: ${error.response.data?.message || error.message}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            throw new common_1.HttpException('Failed to communicate with AI microservice for batch predictions', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async getRecommendations(applicantData, limit = 10) {
        try {
            this.logger.log(`Requesting recommendations for applicant ${applicantData.id}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.config.baseUrl}/api/v1/recommendations`, {
                applicant: applicantData,
                limit,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: this.config.timeout,
            }));
            if (response.status !== 200) {
                throw new common_1.HttpException('AI microservice returned non-200 status for recommendations', common_1.HttpStatus.BAD_GATEWAY);
            }
            const recommendations = response.data.recommendations;
            this.logger.log(`Received ${recommendations.length} recommendations for applicant ${applicantData.id}`);
            return recommendations;
        }
        catch (error) {
            this.logger.error(`Error getting recommendations from AI microservice: ${error.message}`);
            if (error.response) {
                throw new common_1.HttpException(`AI microservice recommendations error: ${error.response.data?.message || error.message}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            throw new common_1.HttpException('Failed to get recommendations from AI microservice', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async isHealthy() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.config.baseUrl}/health`, {
                timeout: 5000,
            }));
            return response.status === 200;
        }
        catch (error) {
            this.logger.warn(`AI microservice health check failed: ${error.message}`);
            return false;
        }
    }
    async getStatus() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.config.baseUrl}/status`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                timeout: 5000,
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error getting AI microservice status: ${error.message}`);
            throw new common_1.HttpException('Failed to get AI microservice status', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
};
exports.AiMicroserviceService = AiMicroserviceService;
exports.AiMicroserviceService = AiMicroserviceService = AiMicroserviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AiMicroserviceService);
//# sourceMappingURL=ai-microservice.service.js.map