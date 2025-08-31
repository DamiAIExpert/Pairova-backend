import { Application } from '../../../jobs/entities/application.entity';
import { User } from '../../../users/shared/user.entity';
export declare enum InterviewStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}
export declare class Interview {
    id: string;
    applicationId: string;
    application: Application;
    scheduledById: string;
    scheduledBy: User;
    startAt: Date;
    endAt: Date;
    meetingLink: string;
    status: InterviewStatus;
    createdAt: Date;
}
