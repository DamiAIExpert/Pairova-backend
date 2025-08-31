import { User } from '../../users/shared/user.entity';
import { NotificationType } from '../../common/enums/notification-type.enum';
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    title: string;
    body: string;
    data: Record<string, any>;
    readAt: Date;
    createdAt: Date;
}
