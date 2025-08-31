import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { User } from '../users/shared/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class ChatService {
    private readonly messageRepository;
    private readonly conversationRepository;
    private readonly participantRepository;
    constructor(messageRepository: Repository<Message>, conversationRepository: Repository<Conversation>, participantRepository: Repository<ConversationParticipant>);
    createMessage(createMessageDto: CreateMessageDto, sender: User): Promise<Message>;
    getMessagesForConversation(conversationId: string, userId: string): Promise<Message[]>;
    isUserInConversation(userId: string, conversationId: string): Promise<boolean>;
}
