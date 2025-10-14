"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_sms_controller_1 = require("./controllers/admin-sms.controller");
const sms_service_1 = require("./services/sms.service");
const sms_provider_factory_service_1 = require("./services/sms-provider-factory.service");
const sms_provider_entity_1 = require("./entities/sms-provider.entity");
const sms_log_entity_1 = require("./entities/sms-log.entity");
let SmsModule = class SmsModule {
};
exports.SmsModule = SmsModule;
exports.SmsModule = SmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                sms_provider_entity_1.SmsProvider,
                sms_log_entity_1.SmsLog,
            ]),
        ],
        controllers: [admin_sms_controller_1.AdminSmsController],
        providers: [sms_service_1.SmsService, sms_provider_factory_service_1.SmsProviderFactory],
        exports: [sms_service_1.SmsService, sms_provider_factory_service_1.SmsProviderFactory],
    })
], SmsModule);
//# sourceMappingURL=sms.module.js.map