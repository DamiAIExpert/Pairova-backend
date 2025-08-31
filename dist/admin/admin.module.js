"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const logs_controller_1 = require("./audit/logs.controller");
const logs_service_1 = require("./audit/logs.service");
const pages_controller_1 = require("./pages/pages.controller");
const pages_service_1 = require("./pages/pages.service");
const audit_log_entity_1 = require("./audit/entities/audit-log.entity");
const page_entity_1 = require("./pages/entities/page.entity");
const user_entity_1 = require("../users/shared/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../jobs/entities/application.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([audit_log_entity_1.AuditLog, page_entity_1.Page, user_entity_1.User, job_entity_1.Job, application_entity_1.Application])],
        controllers: [admin_controller_1.AdminController, logs_controller_1.LogsController, pages_controller_1.PagesController],
        providers: [admin_service_1.AdminService, logs_service_1.LogsService, pages_service_1.PagesService],
        exports: [admin_service_1.AdminService, logs_service_1.LogsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map