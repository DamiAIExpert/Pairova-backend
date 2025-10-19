import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider, SmsProviderType } from '../entities/sms-provider.entity';

/**
 * @interface SmsProviderInterface
 * @description Interface for SMS provider implementations
 */
export interface SmsProviderInterface {
  sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult>;
  validateConfiguration(config: any): Promise<boolean>;
  getHealthStatus(): Promise<SmsHealthStatus>;
  getBalance?(): Promise<number>;
  getDeliveryStatus?(messageId: string): Promise<SmsDeliveryStatus>;
}

/**
 * @interface SmsSendResult
 * @description Result of SMS sending operation
 */
export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  providerReference?: string;
  cost?: number;
  currency?: string;
  error?: string;
  errorCode?: string;
}

/**
 * @interface SmsHealthStatus
 * @description SMS provider health status
 */
export interface SmsHealthStatus {
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  balance?: number;
  lastChecked: Date;
}

/**
 * @interface SmsDeliveryStatus
 * @description SMS delivery status
 */
export interface SmsDeliveryStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'failed' | 'unknown';
  deliveredAt?: Date;
  error?: string;
}

/**
 * @class TwilioSmsProvider
 * @description Twilio SMS provider implementation
 */
export class TwilioSmsProvider implements SmsProviderInterface {
  private readonly logger = new Logger(TwilioSmsProvider.name);
  private twilio: any;

  constructor(private config: any) {
    // Initialize Twilio SDK
    try {
      const twilio = require('twilio');
      this.twilio = twilio(config.accountSid, config.authToken);
    } catch (error) {
      this.logger.error('Failed to initialize Twilio SDK', error);
    }
  }

  async sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult> {
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
    } catch (error) {
      this.logger.error(`Twilio SMS send failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        errorCode: error.code?.toString(),
      };
    }
  }

  async validateConfiguration(config: any): Promise<boolean> {
    try {
      const twilio = require('twilio');
      const client = twilio(config.accountSid, config.authToken);
      await client.api.accounts(config.accountSid).fetch();
      return true;
    } catch (error) {
      this.logger.error(`Twilio config validation failed: ${error.message}`);
      return false;
    }
  }

  async getHealthStatus(): Promise<SmsHealthStatus> {
    const startTime = Date.now();
    try {
      const account = await this.twilio.api.accounts(this.config.accountSid).fetch();
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime,
        balance: parseFloat(account.balance),
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }

  async getDeliveryStatus(messageId: string): Promise<SmsDeliveryStatus> {
    try {
      const message = await this.twilio.messages(messageId).fetch();
      return {
        messageId,
        status: message.status === 'delivered' ? 'delivered' : 
                message.status === 'failed' ? 'failed' : 'sent',
        deliveredAt: message.dateUpdated,
      };
    } catch (error) {
      return {
        messageId,
        status: 'unknown',
        error: error.message,
      };
    }
  }
}

/**
 * @class ClickatellSmsProvider
 * @description Clickatell SMS provider implementation
 */
export class ClickatellSmsProvider implements SmsProviderInterface {
  private readonly logger = new Logger(ClickatellSmsProvider.name);

  constructor(private config: any) {}

  async sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult> {
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
      
      if (response.ok && (result as any).messages?.[0]) {
        return {
          success: true,
          messageId: (result as any).messages[0].apiMessageId,
          providerReference: (result as any).messages[0].apiMessageId,
        };
      } else {
        throw new Error((result as any).error?.description || 'Unknown error');
      }
    } catch (error) {
      this.logger.error(`Clickatell SMS send failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async validateConfiguration(config: any): Promise<boolean> {
    try {
      const response = await fetch('https://platform.clickatell.com/rest/balance', {
        headers: {
          'Authorization': config.apiKey,
        },
      });
      return response.ok;
    } catch (error) {
      this.logger.error(`Clickatell config validation failed: ${error.message}`);
      return false;
    }
  }

  async getHealthStatus(): Promise<SmsHealthStatus> {
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
          balance: (data as any).balance,
          lastChecked: new Date(),
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }
}

/**
 * @class Msg91SmsProvider
 * @description MSG91 SMS provider implementation
 */
export class Msg91SmsProvider implements SmsProviderInterface {
  private readonly logger = new Logger(Msg91SmsProvider.name);

  constructor(private config: any) {}

  async sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult> {
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
      
      if (response.ok && (result as any).type === 'success') {
        return {
          success: true,
          messageId: (result as any).request_id,
          providerReference: (result as any).request_id,
        };
      } else {
        throw new Error((result as any).message || 'Unknown error');
      }
    } catch (error) {
      this.logger.error(`MSG91 SMS send failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async validateConfiguration(config: any): Promise<boolean> {
    try {
      const response = await fetch(`https://control.msg91.com/api/balance.php?authkey=${config.authKey}&type=4`);
      return response.ok;
    } catch (error) {
      this.logger.error(`MSG91 config validation failed: ${error.message}`);
      return false;
    }
  }

  async getHealthStatus(): Promise<SmsHealthStatus> {
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
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }
}

/**
 * @class AfricastalkingSmsProvider
 * @description Africastalking SMS provider implementation
 */
export class AfricastalkingSmsProvider implements SmsProviderInterface {
  private readonly logger = new Logger(AfricastalkingSmsProvider.name);

  constructor(private config: any) {}

  async sendSms(recipient: string, message: string, options?: any): Promise<SmsSendResult> {
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
      
      if (response.ok && (result as any).SMSMessageData?.Recipients?.[0]) {
        const recipient = (result as any).SMSMessageData.Recipients[0];
        return {
          success: recipient.status === 'Success',
          messageId: recipient.messageId,
          providerReference: recipient.messageId,
          error: recipient.status !== 'Success' ? recipient.status : undefined,
        };
      } else {
        throw new Error((result as any).SMSMessageData?.Message || 'Unknown error');
      }
    } catch (error) {
      this.logger.error(`Africastalking SMS send failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async validateConfiguration(config: any): Promise<boolean> {
    try {
      const response = await fetch('https://api.africastalking.com/version1/user', {
        headers: {
          'apiKey': config.apiKey,
        },
      });
      return response.ok;
    } catch (error) {
      this.logger.error(`Africastalking config validation failed: ${error.message}`);
      return false;
    }
  }

  async getHealthStatus(): Promise<SmsHealthStatus> {
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
          balance: (data as any).balance,
          lastChecked: new Date(),
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error.message,
        lastChecked: new Date(),
      };
    }
  }
}

/**
 * @class SmsProviderFactory
 * @description Factory for creating SMS provider instances
 */
@Injectable()
export class SmsProviderFactory {
  private readonly logger = new Logger(SmsProviderFactory.name);

  /**
   * Create SMS provider instance based on type
   */
  createProvider(providerType: SmsProviderType, config: any): SmsProviderInterface {
    switch (providerType) {
      case SmsProviderType.TWILIO:
        return new TwilioSmsProvider(config.twilio || config);
      
      case SmsProviderType.CLICKATELL:
        return new ClickatellSmsProvider(config.clickatell || config);
      
      case SmsProviderType.MSG91:
        return new Msg91SmsProvider(config.msg91 || config);
      
      case SmsProviderType.AFRICASTALKING:
        return new AfricastalkingSmsProvider(config.africastalking || config);
      
      case SmsProviderType.NEXMO:
        // TODO: Implement Nexmo provider
        throw new Error('Nexmo provider not implemented yet');
      
      case SmsProviderType.CM_COM:
        // TODO: Implement CM.com provider
        throw new Error('CM.com provider not implemented yet');
      
      case SmsProviderType.TELESIGN:
        // TODO: Implement Telesign provider
        throw new Error('Telesign provider not implemented yet');
      
      default:
        throw new Error(`Unknown SMS provider type: ${providerType}`);
    }
  }

  /**
   * Get list of supported provider types
   */
  getSupportedProviders(): SmsProviderType[] {
    return [
      SmsProviderType.TWILIO,
      SmsProviderType.CLICKATELL,
      SmsProviderType.MSG91,
      SmsProviderType.AFRICASTALKING,
      // SmsProviderType.NEXMO, // TODO: Implement
      // SmsProviderType.CM_COM, // TODO: Implement
      // SmsProviderType.TELESIGN, // TODO: Implement
    ];
  }

  /**
   * Validate provider configuration
   */
  async validateProviderConfig(providerType: SmsProviderType, config: any): Promise<boolean> {
    try {
      const provider = this.createProvider(providerType, config);
      return await provider.validateConfiguration(config);
    } catch (error) {
      this.logger.error(`Provider validation failed for ${providerType}: ${error.message}`);
      return false;
    }
  }
}
