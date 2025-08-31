import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    private isEnabled;
    constructor(configService: ConfigService);
    send(to: string, subject: string, html: string): Promise<{
        messageId?: string;
        error?: string;
    }>;
    sendFromTemplate(to: string, subject: string, templateName: string, context: Record<string, any>): Promise<{
        messageId?: string;
        error?: string;
    }>;
}
