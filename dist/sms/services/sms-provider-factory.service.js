"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SmsProviderFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsProviderFactory = exports.AfricastalkingSmsProvider = exports.Msg91SmsProvider = exports.ClickatellSmsProvider = exports.TwilioSmsProvider = void 0;
const common_1 = require("@nestjs/common");
const sms_provider_entity_1 = require("../entities/sms-provider.entity");
class TwilioSmsProvider {
    config;
    logger = new common_1.Logger(TwilioSmsProvider.name);
    twilio;
    constructor(config) {
        this.config = config;
        try {
            const twilio = require('twilio');
            this.twilio = twilio(config.accountSid, config.authToken);
        }
        catch (error) {
            this.logger.error('Failed to initialize Twilio SDK', error);
        }
    }
    async sendSms(recipient, message, options) {
        try {
            const response = await this.twilio.messages.create({
                body: message,
                from: this.config.fromNumber,
                to: recipient,
                ...options,
            });
            return {
                success: true,
                messageId: response.sid,
                providerReference: response.sid,
                cost: parseFloat(response.price) || 0,
                currency: response.priceUnit || 'USD',
            };
        }
        catch (error) {
            this.logger.error(`Twilio SMS send failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                errorCode: error.code?.toString(),
            };
        }
    }
    async validateConfiguration(config) {
        try {
            const twilio = require('twilio');
            const client = twilio(config.accountSid, config.authToken);
            await client.api.accounts(config.accountSid).fetch();
            return true;
        }
        catch (error) {
            this.logger.error(`Twilio config validation failed: ${error.message}`);
            return false;
        }
    }
    async getHealthStatus() {
        const startTime = Date.now();
        try {
            const account = await this.twilio.api.accounts(this.config.accountSid).fetch();
            return {
                isHealthy: true,
                responseTime: Date.now() - startTime,
                balance: parseFloat(account.balance),
                lastChecked: new Date(),
            };
        }
        catch (error) {
            return {
                isHealthy: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                lastChecked: new Date(),
            };
        }
    }
    async getDeliveryStatus(messageId) {
        try {
            const message = await this.twilio.messages(messageId).fetch();
            return {
                messageId,
                status: message.status === 'delivered' ? 'delivered' :
                    message.status === 'failed' ? 'failed' : 'sent',
                deliveredAt: message.dateUpdated,
            };
        }
        catch (error) {
            return {
                messageId,
                status: 'unknown',
                error: error.message,
            };
        }
    }
}
exports.TwilioSmsProvider = TwilioSmsProvider;
class ClickatellSmsProvider {
    config;
    logger = new common_1.Logger(ClickatellSmsProvider.name);
    constructor(config) {
        this.config = config;
    }
    async sendSms(recipient, message, options) {
        try {
            const response = await fetch('https://platform.clickatell.com/messages/http/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.config.apiKey,
                },
                body: JSON.stringify({
                    to: [recipient],
                    content: message,
                    from: this.config.fromNumber,
                    ...options,
                }),
            });
            const result = await response.json();
            if (response.ok && result.messages?.[0]) {
                return {
                    success: true,
                    messageId: result.messages[0].apiMessageId,
                    providerReference: result.messages[0].apiMessageId,
                };
            }
            else {
                throw new Error(result.error?.description || 'Unknown error');
            }
        }
        catch (error) {
            this.logger.error(`Clickatell SMS send failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async validateConfiguration(config) {
        try {
            const response = await fetch('https://platform.clickatell.com/rest/balance', {
                headers: {
                    'Authorization': config.apiKey,
                },
            });
            return response.ok;
        }
        catch (error) {
            this.logger.error(`Clickatell config validation failed: ${error.message}`);
            return false;
        }
    }
    async getHealthStatus() {
        const startTime = Date.now();
        try {
            const response = await fetch('https://platform.clickatell.com/rest/balance', {
                headers: {
                    'Authorization': this.config.apiKey,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    isHealthy: true,
                    responseTime: Date.now() - startTime,
                    balance: data.balance,
                    lastChecked: new Date(),
                };
            }
            else {
                throw new Error(`HTTP ${response.status}`);
            }
        }
        catch (error) {
            return {
                isHealthy: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                lastChecked: new Date(),
            };
        }
    }
}
exports.ClickatellSmsProvider = ClickatellSmsProvider;
class Msg91SmsProvider {
    config;
    logger = new common_1.Logger(Msg91SmsProvider.name);
    constructor(config) {
        this.config = config;
    }
    async sendSms(recipient, message, options) {
        try {
            const url = new URL('https://control.msg91.com/api/v5/flow/');
            url.searchParams.append('authkey', this.config.authKey);
            url.searchParams.append('mobiles', recipient);
            url.searchParams.append('message', message);
            url.searchParams.append('sender', this.config.senderId);
            url.searchParams.append('route', this.config.route);
            const response = await fetch(url.toString(), {
                method: 'POST',
            });
            const result = await response.json();
            if (response.ok && result.type === 'success') {
                return {
                    success: true,
                    messageId: result.request_id,
                    providerReference: result.request_id,
                };
            }
            else {
                throw new Error(result.message || 'Unknown error');
            }
        }
        catch (error) {
            this.logger.error(`MSG91 SMS send failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async validateConfiguration(config) {
        try {
            const response = await fetch(`https://control.msg91.com/api/balance.php?authkey=${config.authKey}&type=4`);
            return response.ok;
        }
        catch (error) {
            this.logger.error(`MSG91 config validation failed: ${error.message}`);
            return false;
        }
    }
    async getHealthStatus() {
        const startTime = Date.now();
        try {
            const response = await fetch(`https://control.msg91.com/api/balance.php?authkey=${this.config.authKey}&type=4`);
            if (response.ok) {
                const balance = await response.text();
                return {
                    isHealthy: true,
                    responseTime: Date.now() - startTime,
                    balance: parseFloat(balance),
                    lastChecked: new Date(),
                };
            }
            else {
                throw new Error(`HTTP ${response.status}`);
            }
        }
        catch (error) {
            return {
                isHealthy: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                lastChecked: new Date(),
            };
        }
    }
}
exports.Msg91SmsProvider = Msg91SmsProvider;
class AfricastalkingSmsProvider {
    config;
    logger = new common_1.Logger(AfricastalkingSmsProvider.name);
    constructor(config) {
        this.config = config;
    }
    async sendSms(recipient, message, options) {
        try {
            const response = await fetch('https://api.africastalking.com/version1/messaging', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'apiKey': this.config.apiKey,
                },
                body: new URLSearchParams({
                    username: this.config.username,
                    to: recipient,
                    message: message,
                    from: this.config.fromNumber || 'AFRICASTK',
                }),
            });
            const result = await response.json();
            if (response.ok && result.SMSMessageData?.Recipients?.[0]) {
                const recipient = result.SMSMessageData.Recipients[0];
                return {
                    success: recipient.status === 'Success',
                    messageId: recipient.messageId,
                    providerReference: recipient.messageId,
                    error: recipient.status !== 'Success' ? recipient.status : undefined,
                };
            }
            else {
                throw new Error(result.SMSMessageData?.Message || 'Unknown error');
            }
        }
        catch (error) {
            this.logger.error(`Africastalking SMS send failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async validateConfiguration(config) {
        try {
            const response = await fetch('https://api.africastalking.com/version1/user', {
                headers: {
                    'apiKey': config.apiKey,
                },
            });
            return response.ok;
        }
        catch (error) {
            this.logger.error(`Africastalking config validation failed: ${error.message}`);
            return false;
        }
    }
    async getHealthStatus() {
        const startTime = Date.now();
        try {
            const response = await fetch('https://api.africastalking.com/version1/user', {
                headers: {
                    'apiKey': this.config.apiKey,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    isHealthy: true,
                    responseTime: Date.now() - startTime,
                    balance: data.balance,
                    lastChecked: new Date(),
                };
            }
            else {
                throw new Error(`HTTP ${response.status}`);
            }
        }
        catch (error) {
            return {
                isHealthy: false,
                responseTime: Date.now() - startTime,
                error: error.message,
                lastChecked: new Date(),
            };
        }
    }
}
exports.AfricastalkingSmsProvider = AfricastalkingSmsProvider;
let SmsProviderFactory = SmsProviderFactory_1 = class SmsProviderFactory {
    logger = new common_1.Logger(SmsProviderFactory_1.name);
    createProvider(providerType, config) {
        switch (providerType) {
            case sms_provider_entity_1.SmsProviderType.TWILIO:
                return new TwilioSmsProvider(config.twilio || config);
            case sms_provider_entity_1.SmsProviderType.CLICKATELL:
                return new ClickatellSmsProvider(config.clickatell || config);
            case sms_provider_entity_1.SmsProviderType.MSG91:
                return new Msg91SmsProvider(config.msg91 || config);
            case sms_provider_entity_1.SmsProviderType.AFRICASTALKING:
                return new AfricastalkingSmsProvider(config.africastalking || config);
            case sms_provider_entity_1.SmsProviderType.NEXMO:
                throw new Error('Nexmo provider not implemented yet');
            case sms_provider_entity_1.SmsProviderType.CM_COM:
                throw new Error('CM.com provider not implemented yet');
            case sms_provider_entity_1.SmsProviderType.TELESIGN:
                throw new Error('Telesign provider not implemented yet');
            default:
                throw new Error(`Unknown SMS provider type: ${providerType}`);
        }
    }
    getSupportedProviders() {
        return [
            sms_provider_entity_1.SmsProviderType.TWILIO,
            sms_provider_entity_1.SmsProviderType.CLICKATELL,
            sms_provider_entity_1.SmsProviderType.MSG91,
            sms_provider_entity_1.SmsProviderType.AFRICASTALKING,
        ];
    }
    async validateProviderConfig(providerType, config) {
        try {
            const provider = this.createProvider(providerType, config);
            return await provider.validateConfiguration(config);
        }
        catch (error) {
            this.logger.error(`Provider validation failed for ${providerType}: ${error.message}`);
            return false;
        }
    }
};
exports.SmsProviderFactory = SmsProviderFactory;
exports.SmsProviderFactory = SmsProviderFactory = SmsProviderFactory_1 = __decorate([
    (0, common_1.Injectable)()
], SmsProviderFactory);
//# sourceMappingURL=sms-provider-factory.service.js.map