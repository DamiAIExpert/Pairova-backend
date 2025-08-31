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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsTwilio = sendSmsTwilio;
exports.sendSmsAfricasTalking = sendSmsAfricasTalking;
exports.sendSmsTermii = sendSmsTermii;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const logger = new common_1.Logger('SmsUtils');
async function sendSmsTwilio(to, body) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_SENDER_PHONE;
    if (!accountSid || !authToken || !from) {
        logger.warn(`Twilio credentials not found. Simulating SMS to ${to}.`);
        logger.debug(`[SMS Body]: ${body}`);
        return;
    }
    try {
        const twilio = (await Promise.resolve().then(() => __importStar(require('twilio')))).default;
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({ to, from, body });
        logger.log(`SMS sent to ${to} via Twilio. SID: ${message.sid}`);
    }
    catch (error) {
        logger.error(`Failed to send SMS via Twilio to ${to}`, error.stack);
        throw new Error('Could not send SMS via Twilio.');
    }
}
async function sendSmsAfricasTalking(to, body) {
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const username = process.env.AFRICASTALKING_USERNAME;
    const from = process.env.AFRICASTALKING_SENDER_ID;
    if (!apiKey || !username) {
        logger.warn(`Africa's Talking credentials not found. Simulating SMS to ${to}.`);
        logger.debug(`[SMS Body]: ${body}`);
        return;
    }
    try {
        logger.log(`Simulating SMS to ${to} via Africa's Talking from sender: ${from || 'default'}`);
        logger.debug(`[SMS Body]: ${body}`);
    }
    catch (error) {
        logger.error(`Failed to send SMS via Africa's Talking to ${to}`, error.stack);
        throw new Error('Could not send SMS via Africa\'s Talking.');
    }
}
async function sendSmsTermii(to, body) {
    const apiKey = process.env.TERMII_API_KEY;
    const senderId = process.env.TERMII_SENDER_ID;
    const apiUrl = 'https://api.ng.termii.com/api/sms/send';
    if (!apiKey || !senderId) {
        logger.warn(`Termii credentials not found. Simulating SMS to ${to}.`);
        logger.debug(`[SMS Body]: ${body}`);
        return;
    }
    const payload = {
        to: to,
        from: senderId,
        sms: body,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey,
    };
    try {
        const response = await axios_1.default.post(apiUrl, payload);
        logger.log(`SMS sent to ${to} via Termii. Message ID: ${response.data.message_id}`);
    }
    catch (error) {
        logger.error(`Failed to send SMS via Termii to ${to}`, error.response?.data || error.stack);
        throw new Error('Could not send SMS via Termii.');
    }
}
//# sourceMappingURL=sms.utils.js.map