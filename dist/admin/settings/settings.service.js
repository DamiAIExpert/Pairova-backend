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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_settings_entity_1 = require("./entities/email-settings.entity");
const sms_settings_entity_1 = require("./entities/sms-settings.entity");
let SettingsService = class SettingsService {
    emailSettingsRepository;
    smsSettingsRepository;
    constructor(emailSettingsRepository, smsSettingsRepository) {
        this.emailSettingsRepository = emailSettingsRepository;
        this.smsSettingsRepository = smsSettingsRepository;
    }
    async getEmailSettings() {
        return this.emailSettingsRepository.find();
    }
    async upsertEmailSettings(dto, admin) {
        let settings = await this.emailSettingsRepository.findOne({ where: { provider: dto.provider } });
        if (settings) {
            Object.assign(settings, { ...dto, passwordEnc: dto.password });
        }
        else {
            settings = this.emailSettingsRepository.create({
                ...dto,
                passwordEnc: dto.password,
                createdBy: admin.id,
            });
        }
        return this.emailSettingsRepository.save(settings);
    }
    async getSmsSettings() {
        return this.smsSettingsRepository.find();
    }
    async upsertSmsSettings(dto, admin) {
        let settings = await this.smsSettingsRepository.findOne({ where: { provider: dto.provider } });
        if (settings) {
            Object.assign(settings, { ...dto, apiKeyEnc: dto.apiKey });
        }
        else {
            settings = this.smsSettingsRepository.create({
                ...dto,
                apiKeyEnc: dto.apiKey,
                createdBy: admin.id,
            });
        }
        return this.smsSettingsRepository.save(settings);
    }
    async getContactSettings() {
        return {
            email: 'contact@pairova.com',
            phone: '+1-800-555-PAIROVA',
            address: '123 Innovation Drive, Lagos, Nigeria'
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_settings_entity_1.EmailSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(sms_settings_entity_1.SmsSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map