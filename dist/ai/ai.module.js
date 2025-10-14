"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const ai_controller_1 = require("./ai.controller");
const ai_service_1 = require("./ai.service");
const ai_microservice_service_1 = require("./services/ai-microservice.service");
const prediction_cache_service_1 = require("./services/prediction-cache.service");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../jobs/entities/application.entity");
const user_entity_1 = require("../users/shared/user.entity");
const applicant_entity_1 = require("../users/applicant/applicant.entity");
const nonprofit_entity_1 = require("../users/nonprofit/nonprofit.entity");
const recommendation_score_entity_1 = require("./entities/recommendation-score.entity");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                job_entity_1.Job,
                application_entity_1.Application,
                user_entity_1.User,
                applicant_entity_1.ApplicantProfile,
                nonprofit_entity_1.NonprofitOrg,
                recommendation_score_entity_1.RecommendationScore,
            ]),
            axios_1.HttpModule.register({
                timeout: 30000,
                maxRedirects: 5,
            }),
        ],
        controllers: [ai_controller_1.AiController],
        providers: [ai_service_1.AiService, ai_microservice_service_1.AiMicroserviceService, prediction_cache_service_1.PredictionCacheService],
        exports: [ai_service_1.AiService, ai_microservice_service_1.AiMicroserviceService, prediction_cache_service_1.PredictionCacheService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map