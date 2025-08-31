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
var ReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reminder_entity_1 = require("./entities/reminder.entity");
let ReminderService = ReminderService_1 = class ReminderService {
    reminderRepository;
    logger = new common_1.Logger(ReminderService_1.name);
    constructor(reminderRepository) {
        this.reminderRepository = reminderRepository;
    }
    async scheduleReminder(user, channel, subject, payload, scheduledAt) {
        const reminder = this.reminderRepository.create({
            userId: user.id,
            channel,
            subject,
            payload,
            scheduledAt,
        });
        await this.reminderRepository.save(reminder);
        this.logger.log(`Scheduled a ${channel} reminder for user ${user.id} at ${scheduledAt.toISOString()}`);
        return reminder;
    }
};
exports.ReminderService = ReminderService;
exports.ReminderService = ReminderService = ReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reminder_entity_1.Reminder)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReminderService);
//# sourceMappingURL=reminder.service.js.map