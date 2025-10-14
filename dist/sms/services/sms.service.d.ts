import { Repository } from 'typeorm';
import { SmsProvider } from '../entities/sms-provider.entity';
import { SmsLog, SmsStatus, SmsType } from '../entities/sms-log.entity';
import { SmsProviderFactory } from './sms-provider-factory.service';
import { CreateSmsProviderDto, UpdateSmsProviderDto, SendSmsDto } from '../dto/sms-provider.dto';
export declare class SmsService {
    private readonly smsProviderRepository;
    private readonly smsLogRepository;
    private readonly smsProviderFactory;
    private readonly logger;
    constructor(smsProviderRepository: Repository<SmsProvider>, smsLogRepository: Repository<SmsLog>, smsProviderFactory: SmsProviderFactory);
    createProvider(createProviderDto: CreateSmsProviderDto): Promise<SmsProvider>;
    updateProvider(id: string, updateProviderDto: UpdateSmsProviderDto): Promise<SmsProvider>;
    getProviders(): Promise<SmsProvider[]>;
    getProvider(id: string): Promise<SmsProvider>;
    deleteProvider(id: string): Promise<void>;
    sendSms(sendSmsDto: SendSmsDto): Promise<SmsLog>;
    private attemptSendSms;
    private updateProviderStats;
    performHealthCheck(providerId: string): Promise<void>;
    performHealthCheckAll(): Promise<void>;
    getSmsLogs(page?: number, limit?: number, filters?: {
        providerId?: string;
        status?: SmsStatus;
        type?: SmsType;
        recipient?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        logs: SmsLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSmsStatistics(): Promise<{
        totalSent: number;
        totalDelivered: number;
        totalFailed: number;
        deliveryRate: number;
        totalCost: number;
        providerStats: Array<{
            providerId: string;
            providerName: string;
            totalSent: number;
            totalDelivered: number;
            deliveryRate: number;
            totalCost: number;
        }>;
    }>;
    toggleProviderStatus(providerId: string, isActive: boolean): Promise<SmsProvider>;
    updateProviderPriority(providerId: string, priority: number): Promise<SmsProvider>;
}
