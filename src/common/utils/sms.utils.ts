// src/common/utils/sms.utils.ts
import { Logger } from '@nestjs/common';
import axios from 'axios';

const logger = new Logger('SmsUtils');

/**
 * Sends an SMS using the Twilio service.
 * This function is a wrapper that NO-OPs and logs if environment variables are not set,
 * preventing crashes in development environments.
 * For production, it's recommended to use the official Twilio SDK wrapped in a dedicated service.
 *
 * @param {string} to - The recipient's phone number in E.164 format (e.g., '+1234567890').
 * @param {string} body - The text message content.
 * @returns {Promise<void>}
 */
export async function sendSmsTwilio(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SENDER_PHONE;

  if (!accountSid || !authToken || !from) {
    logger.warn(`Twilio credentials not found. Simulating SMS to ${to}.`);
    logger.debug(`[SMS Body]: ${body}`);
    return;
  }

  try {
    const twilio = (await import('twilio')).default;
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({ to, from, body });
    logger.log(`SMS sent to ${to} via Twilio. SID: ${message.sid}`);
  } catch (error) {
    logger.error(`Failed to send SMS via Twilio to ${to}`, error.stack);
    throw new Error('Could not send SMS via Twilio.');
  }
}

/**
 * Sends an SMS using the Africa's Talking service.
 * This is a simplified example. For production, use the official SDK.
 * This function NO-OPs and logs if environment variables are not set.
 *
 * @param {string} to - The recipient's phone number.
 * @param {string} body - The text message content.
 * @returns {Promise<void>}
 */
export async function sendSmsAfricasTalking(to: string, body: string): Promise<void> {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AFRICASTALKING_USERNAME;
  const from = process.env.AFRICASTALKING_SENDER_ID; // Optional sender ID

  if (!apiKey || !username) {
    logger.warn(`Africa's Talking credentials not found. Simulating SMS to ${to}.`);
    logger.debug(`[SMS Body]: ${body}`);
    return;
  }
  
  // In a real implementation, you would use the 'africastalking' SDK here.
  // This is a placeholder to show the structure.
  try {
    logger.log(`Simulating SMS to ${to} via Africa's Talking from sender: ${from || 'default'}`);
    logger.debug(`[SMS Body]: ${body}`);
    // const AfricasTalking = require('africastalking');
    // const africasTalking = AfricasTalking({ apiKey, username });
    // const sms = africasTalking.SMS;
    // await sms.send({ to: [to], message: body, from });
  } catch (error) {
    logger.error(`Failed to send SMS via Africa's Talking to ${to}`, error.stack);
    throw new Error('Could not send SMS via Africa\'s Talking.');
  }
}

/**
 * Sends an SMS using the Termii service.
 * This function NO-OPs and logs if environment variables are not set.
 * It uses a direct API call with axios.
 *
 * @param {string} to - The recipient's phone number.
 * @param {string} body - The text message content.
 * @returns {Promise<void>}
 */
export async function sendSmsTermii(to: string, body: string): Promise<void> {
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
        const response = await axios.post(apiUrl, payload);
        logger.log(`SMS sent to ${to} via Termii. Message ID: ${response.data.message_id}`);
    } catch (error) {
        logger.error(`Failed to send SMS via Termii to ${to}`, error.response?.data || error.stack);
        throw new Error('Could not send SMS via Termii.');
    }
}

