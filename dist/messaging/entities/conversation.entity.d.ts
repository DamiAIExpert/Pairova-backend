import { Message } from './message.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { User } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
export declare enum ConversationType {
    DIRECT = "DIRECT",
    JOB_RELATED = "JOB_RELATED",
    INTERVIEW = "INTERVIEW",
    SUPPORT = "SUPPORT"
}
export declare enum ConversationStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED"
}
export declare class Conversation {
    id: string;
    type: ConversationType;
    status: ConversationStatus;
    title: string | null;
    description: string | null;
    jobId: string | null;
    job: Job | null;
    createdById: string | null;
    createdBy: User | null;
    isArchived: boolean;
    lastMessageAt: Date | null;
    metadata: {
        applicationId?: string;
        interviewId?: string;
        tags?: string[];
        priority?: 'LOW' | 'MEDIUM' | 'HIGH';
        category?: string;
    } | null;
    messages: Message[];
    participants: ConversationParticipant[];
    createdAt: Date;
    updatedAt: Date;
}
