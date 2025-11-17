"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const handlebars = __importStar(require("handlebars"));
const url_helper_1 = require("../common/utils/url.helper");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    isEnabled;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT', 587);
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        const secure = this.configService.get('SMTP_SECURE', false);
        if (host && user && pass) {
            this.isEnabled = true;
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            });
            this.logger.log('EmailService initialized and enabled.');
        }
        else {
            this.isEnabled = false;
            this.logger.warn('EmailService is disabled due to missing SMTP configuration.');
        }
    }
    async send(to, subject, html) {
        if (!this.isEnabled) {
            this.logger.warn(`Email sending is disabled. Simulated email to: ${to}, Subject: ${subject}`);
            return {};
        }
        const from = this.configService.get('SMTP_FROM', 'Pairova <noreply@pairova.com>');
        try {
            const info = await this.transporter.sendMail({ from, to, subject, html });
            this.logger.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
            return { messageId: info.messageId };
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}. Subject: ${subject}`, error.stack);
            return { error: error.message };
        }
    }
    async sendFromTemplate(to, subject, templateName, context) {
        try {
            const templatePath = path.join(process.cwd(), 'src', 'notifications', 'templates', `${templateName}.hbs`);
            const templateSource = await fs.readFile(templatePath, 'utf-8');
            const template = handlebars.compile(templateSource);
            const frontendUrl = url_helper_1.UrlHelper.getFrontendUrl(this.configService);
            const enrichedContext = {
                ...context,
                logoUrl: context.logoUrl || `${frontendUrl}/Images/logo.AVIF`,
                year: context.year || new Date().getFullYear(),
            };
            const html = template(enrichedContext);
            return this.send(to, subject, html);
        }
        catch (error) {
            this.logger.error(`Error processing email template '${templateName}'`, error.stack);
            return { error: `Template error: ${error.message}` };
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map