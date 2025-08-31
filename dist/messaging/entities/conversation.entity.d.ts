import { User } from '../../users/shared/user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from './message.entity';
export declare class Conversation {
    id: string;
    createdByUserId: string;
    createdBy: User;
    relatedJobId: string;
    relatedJob: Job;
    messages: Message[];
    participants: ConversationParticipant[];
    isGroup: boolean;
    createdAt: Date;
}
