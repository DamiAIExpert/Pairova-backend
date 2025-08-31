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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSettingsService = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
let ContactSettingsService = class ContactSettingsService {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    get() {
        return this.settingsService.getContactSettings();
    }
    set(dto, admin) {
        console.log('Updating contact settings (simulation):', { dto, adminId: admin.id });
        return this.settingsService.getContactSettings();
    }
};
exports.ContactSettingsService = ContactSettingsService;
exports.ContactSettingsService = ContactSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], ContactSettingsService);
//# sourceMappingURL=contact-settings.service.js.map