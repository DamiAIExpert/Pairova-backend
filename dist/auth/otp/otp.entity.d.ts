import { User } from '../../users/shared/user.entity';
import { OtpChannel } from '../../common/enums/otp-channel.enum';
export declare class Otp {
    id: string;
    userId: string;
    user: User;
    channel: OtpChannel;
    codeHash: string;
    expiresAt: Date;
    consumedAt: Date | null;
    createdAt: Date;
}
