// src/messaging/dto/create-message.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'The UUID of the conversation to send the message to.' })
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ description: 'The text content of the message.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The optional UUID of an uploaded attachment.', required: false })
  @IsOptional()
  @IsUUID()
  attachmentId?: string;
}
