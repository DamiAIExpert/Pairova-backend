import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { OtpChannel } from '../../common/enums/otp-channel.enum';
import { User } from '../../users/shared/user.entity';
export declare class OtpService {
    private readonly otpRepo;
    constructor(otpRepo: Repository<Otp>);
    private generateNumericCode;
    generateOtp(user: User | string, channel: OtpChannel, ttlMinutes?: number): Promise<{
        id: string;
        code: string;
    }>;
    validateOtp(userId: string, token: string, channel?: OtpChannel): Promise<Otp | null>;
    consumeOtp(id: string): Promise<void>;
}
