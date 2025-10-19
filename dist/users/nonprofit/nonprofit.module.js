"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonprofitModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nonprofit_controller_1 = require("./nonprofit.controller");
const nonprofit_service_1 = require("./nonprofit.service");
const nonprofit_entity_1 = require("./nonprofit.entity");
const ngo_jobs_controller_1 = require("./ngo-jobs.controller");
const ngo_applications_controller_1 = require("./ngo-applications.controller");
const jobs_module_1 = require("../../jobs/jobs.module");
let NonprofitModule = class NonprofitModule {
};
exports.NonprofitModule = NonprofitModule;
exports.NonprofitModule = NonprofitModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([nonprofit_entity_1.NonprofitOrg]),
            jobs_module_1.JobsModule,
        ],
        controllers: [nonprofit_controller_1.NonprofitController, ngo_jobs_controller_1.NgoJobsController, ngo_applications_controller_1.NgoApplicationsController],
        providers: [nonprofit_service_1.NonprofitService],
        exports: [nonprofit_service_1.NonprofitService],
    })
], NonprofitModule);
//# sourceMappingURL=nonprofit.module.js.map