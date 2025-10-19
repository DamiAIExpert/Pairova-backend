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
exports.NotificationPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_preferences_entity_1 = require("./entities/notification-preferences.entity");
let NotificationPreferencesService = class NotificationPreferencesService {
    preferencesRepository;
    constructor(preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }
    async getOrCreatePreferences(userId) {
        let preferences = await this.preferencesRepository.findOne({
            where: { userId },
        });
        if (!preferences) {
            preferences = this.preferencesRepository.create({
                userId,
            });
            preferences = await this.preferencesRepository.save(preferences);
        }
        return preferences;
    }
    async updatePreferences(userId, updates) {
        const preferences = await this.getOrCreatePreferences(userId);
        Object.assign(preferences, updates);
        return this.preferencesRepository.save(preferences);
    }
    async getPreferencesForApi(userId) {
        const preferences = await this.getOrCreatePreferences(userId);
        return {
            email: preferences.emailEnabled,
            push: preferences.pushEnabled,
            sms: preferences.smsEnabled,
            reminders: preferences.remindersEnabled,
            emailJobMatches: preferences.emailJobMatches,
            emailApplicationUpdates: preferences.emailApplicationUpdates,
            emailInterviews: preferences.emailInterviews,
            emailMessages: preferences.emailMessages,
            emailSystem: preferences.emailSystem,
            pushJobMatches: preferences.pushJobMatches,
            pushApplicationUpdates: preferences.pushApplicationUpdates,
            pushInterviews: preferences.pushInterviews,
            pushMessages: preferences.pushMessages,
            pushSystem: preferences.pushSystem,
            smsJobMatches: preferences.smsJobMatches,
            smsApplicationUpdates: preferences.smsApplicationUpdates,
            smsInterviews: preferences.smsInterviews,
            smsMessages: preferences.smsMessages,
            smsSystem: preferences.smsSystem,
        };
    }
};
exports.NotificationPreferencesService = NotificationPreferencesService;
exports.NotificationPreferencesService = NotificationPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_preferences_entity_1.NotificationPreferences)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationPreferencesService);
//# sourceMappingURL=notification-preferences.service.js.map