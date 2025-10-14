import { SmsService } from '../services/sms.service';
import { CreateSmsProviderDto, UpdateSmsProviderDto, SmsProviderResponseDto, SmsLogResponseDto } from '../dto/sms-provider.dto';
import { SmsStatus, SmsType } from '../entities/sms-log.entity';
export declare class AdminSmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    createProvider(createProviderDto: CreateSmsProviderDto): Promise<SmsProviderResponseDto>;
    getProviders(): Promise<SmsProviderResponseDto[]>;
    getProvider(id: string): Promise<SmsProviderResponseDto>;
    updateProvider(id: string, updateProviderDto: UpdateSmsProviderDto): Promise<SmsProviderResponseDto>;
    deleteProvider(id: string): Promise<{
        message: string;
    }>;
    toggleProviderStatus(id: string, isActive: boolean): Promise<SmsProviderResponseDto>;
    updateProviderPriority(id: string, priority: number): Promise<SmsProviderResponseDto>;
    performHealthCheck(id: string): Promise<{
        message: string;
    }>;
    performHealthCheckAll(): Promise<{
        message: string;
    }>;
    getSmsLogs(page?: number, limit?: number, providerId?: string, status?: SmsStatus, type?: SmsType, recipient?: string, startDate?: string, endDate?: string): Promise<{
        logs: SmsLogResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
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
    sendTestSms(body: {
        recipient: string;
        message?: string;
        providerId?: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    getSupportedProviderTypes(): Promise<{
        types: Array<{
            type: string;
            name: string;
            description: string;
            features: string[];
            website?: string;
        }>;
    }>;
}
