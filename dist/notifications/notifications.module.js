"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reminder_entity_1 = require("./entities/reminder.entity");
const notification_entity_1 = require("./entities/notification.entity");
const notification_preferences_entity_1 = require("./entities/notification-preferences.entity");
const reminder_service_1 = require("./reminder.service");
const email_service_1 = require("./email.service");
const notification_service_1 = require("./notification.service");
const notification_preferences_service_1 = require("./notification-preferences.service");
const notifications_controller_1 = require("./notifications.controller");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reminder_entity_1.Reminder, notification_entity_1.Notification, notification_preferences_entity_1.NotificationPreferences])],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [reminder_service_1.ReminderService, email_service_1.EmailService, notification_service_1.NotificationService, notification_preferences_service_1.NotificationPreferencesService],
        exports: [reminder_service_1.ReminderService, email_service_1.EmailService, notification_service_1.NotificationService, notification_preferences_service_1.NotificationPreferencesService, typeorm_1.TypeOrmModule],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map