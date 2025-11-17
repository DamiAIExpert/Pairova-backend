// src/notifications/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { UrlHelper } from '../common/utils/url.helper';

/**
 * @class EmailService
 * @description Handles all email-sending functionalities for the application.
 * It uses Nodemailer and integrates with a templating engine (Handlebars)
 * to send dynamic, template-based emails.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure = this.configService.get<boolean>('SMTP_SECURE', false);

    if (host && user && pass) {
      this.isEnabled = true;
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      this.logger.log('EmailService initialized and enabled.');
    } else {
      this.isEnabled = false;
      this.logger.warn('EmailService is disabled due to missing SMTP configuration.');
    }
  }

  /**
   * Sends a raw HTML email.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param html - The HTML content of the email body.
   * @returns {Promise<{ messageId?: string; error?: string }>} The result of the send operation.
   */
  async send(to: string, subject: string, html: string): Promise<{ messageId?: string; error?: string }> {
    if (!this.isEnabled) {
      this.logger.warn(`Email sending is disabled. Simulated email to: ${to}, Subject: ${subject}`);
      return {};
    }

    const from = this.configService.get<string>('SMTP_FROM', 'Pairova <noreply@pairova.com>');

    try {
      const info = await this.transporter.sendMail({ from, to, subject, html });
      this.logger.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
      return { messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}. Subject: ${subject}`, error.stack);
      return { error: error.message };
    }
  }

  /**
   * Sends an email using a Handlebars template.
   * This is the recommended method for sending emails.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param templateName - The name of the Handlebars template file (without .hbs extension).
   * @param context - The data to pass to the template.
   * @returns {Promise<{ messageId?: string; error?: string }>} The result of the send operation.
   */
  async sendFromTemplate(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<{ messageId?: string; error?: string }> {
    try {
      const templatePath = path.join(process.cwd(), 'src', 'notifications', 'templates', `${templateName}.hbs`);
      const templateSource = await fs.readFile(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      
      // Add logo URL and year to context if not already provided
      const frontendUrl = UrlHelper.getFrontendUrl(this.configService);
      const enrichedContext = {
        ...context,
        logoUrl: context.logoUrl || `${frontendUrl}/Images/logo.AVIF`,
        year: context.year || new Date().getFullYear(),
      };
      
      const html = template(enrichedContext);
      return this.send(to, subject, html);
    } catch (error) {
      this.logger.error(`Error processing email template '${templateName}'`, error.stack);
      return { error: `Template error: ${error.message}` };
    }
  }
}

