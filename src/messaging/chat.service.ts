// src/messaging/chat.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { User } from '../users/shared/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
  ) {}

  /**
   * Persist a new message for a conversation.
   */
  async createMessage(
    createMessageDto: CreateMessageDto,
    sender: User,
  ): Promise<Message> {
    const { conversationId, content, attachmentId } = createMessageDto;

    // Ensure conversation exists (optional but helpful)
    const convo = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!convo) {
      throw new UnauthorizedException('Conversation not found or inaccessible.');
    }

    // Verify the sender participates in the conversation
    const isParticipant = await this.isUserInConversation(sender.id, conversationId);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not a participant of this conversation.');
    }

    const message = this.messageRepository.create({
      conversationId,
      content,
      attachmentId: attachmentId ?? null,
      senderId: sender.id,
    });

    return this.messageRepository.save(message);
  }

  /**
   * Retrieve messages for a conversation the user participates in.
   */
  async getMessagesForConversation(
    conversationId: string,
    userId: string,
  ): Promise<Message[]> {
    const isParticipant = await this.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new UnauthorizedException('You are not authorized to view these messages.');
    }

    return this.messageRepository.find({
      where: { conversationId },
      order: { sentAt: 'ASC' },
      relations: ['sender'], // add more if needed, e.g. 'sender.applicantProfile'
    });
  }

  /**
   * Check if a user is part of a conversation.
   */
  async isUserInConversation(userId: string, conversationId: string): Promise<boolean> {
    const participant = await this.participantRepository.findOne({
      where: { userId, conversationId },
    });
    return !!participant;
    }
}
