"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSearchDto = exports.MessageStatusUpdateDto = exports.ConversationResponseDto = exports.MessageResponseDto = exports.SendMessageDto = exports.UpdateConversationDto = exports.CreateConversationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const conversation_entity_1 = require("../entities/conversation.entity");
const message_entity_1 = require("../entities/message.entity");
const message_status_entity_1 = require("../entities/message-status.entity");
class CreateConversationDto {
    type;
    title;
    description;
    jobId;
    participantIds;
    applicationId;
    interviewId;
    metadata;
}
exports.CreateConversationDto = CreateConversationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: conversation_entity_1.ConversationType, description: 'Type of conversation' }),
    (0, class_validator_1.IsEnum)(conversation_entity_1.ConversationType),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Job ID if job-related conversation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of participant user IDs', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], CreateConversationDto.prototype, "participantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Application ID if related to an application' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "applicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Interview ID if interview-related' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "interviewId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateConversationDto.prototype, "metadata", void 0);
class UpdateConversationDto {
    title;
    description;
    status;
    isArchived;
    metadata;
}
exports.UpdateConversationDto = UpdateConversationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConversationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConversationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: conversation_entity_1.ConversationStatus, description: 'Conversation status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(conversation_entity_1.ConversationStatus),
    __metadata("design:type", String)
], UpdateConversationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether conversation is archived' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateConversationDto.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateConversationDto.prototype, "metadata", void 0);
class SendMessageDto {
    conversationId;
    content;
    type;
    attachmentId;
    replyToId;
    metadata;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversation ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message content' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: message_entity_1.MessageType, description: 'Message type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(message_entity_1.MessageType),
    __metadata("design:type", String)
], SendMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Attachment file ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "attachmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reply to message ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "replyToId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "metadata", void 0);
class MessageResponseDto {
    id;
    conversationId;
    senderId;
    sender;
    type;
    content;
    attachment;
    replyTo;
    status;
    sentAt;
    isDeleted;
    metadata;
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message ID' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversation ID' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sender ID' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sender information' }),
    __metadata("design:type", Object)
], MessageResponseDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: message_entity_1.MessageType, description: 'Message type' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message content' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Attachment information' }),
    __metadata("design:type", Object)
], MessageResponseDto.prototype, "attachment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reply to message' }),
    __metadata("design:type", Object)
], MessageResponseDto.prototype, "replyTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message status for current user' }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sent timestamp' }),
    __metadata("design:type", Date)
], MessageResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether message is deleted' }),
    __metadata("design:type", Boolean)
], MessageResponseDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Message metadata' }),
    __metadata("design:type", Object)
], MessageResponseDto.prototype, "metadata", void 0);
class ConversationResponseDto {
    id;
    type;
    status;
    title;
    description;
    job;
    participants;
    lastMessage;
    lastMessageAt;
    unreadCount;
    createdAt;
    metadata;
}
exports.ConversationResponseDto = ConversationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Conversation ID' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: conversation_entity_1.ConversationType, description: 'Conversation type' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: conversation_entity_1.ConversationStatus, description: 'Conversation status' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation title' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation description' }),
    __metadata("design:type", String)
], ConversationResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Job information' }),
    __metadata("design:type", Object)
], ConversationResponseDto.prototype, "job", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Participants' }),
    __metadata("design:type", Array)
], ConversationResponseDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last message' }),
    __metadata("design:type", MessageResponseDto)
], ConversationResponseDto.prototype, "lastMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last message timestamp' }),
    __metadata("design:type", Date)
], ConversationResponseDto.prototype, "lastMessageAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unread message count' }),
    __metadata("design:type", Number)
], ConversationResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ConversationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conversation metadata' }),
    __metadata("design:type", Object)
], ConversationResponseDto.prototype, "metadata", void 0);
class MessageStatusUpdateDto {
    status;
    messageId;
}
exports.MessageStatusUpdateDto = MessageStatusUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: message_status_entity_1.MessageStatusType, description: 'New message status' }),
    (0, class_validator_1.IsEnum)(message_status_entity_1.MessageStatusType),
    __metadata("design:type", String)
], MessageStatusUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MessageStatusUpdateDto.prototype, "messageId", void 0);
class ConversationSearchDto {
    query;
    type;
    jobId;
    participantId;
    includeArchived;
    page = 1;
    limit = 20;
}
exports.ConversationSearchDto = ConversationSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConversationSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: conversation_entity_1.ConversationType, description: 'Filter by conversation type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(conversation_entity_1.ConversationType),
    __metadata("design:type", String)
], ConversationSearchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by job ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ConversationSearchDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by participant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ConversationSearchDto.prototype, "participantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include archived conversations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConversationSearchDto.prototype, "includeArchived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ConversationSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ConversationSearchDto.prototype, "limit", void 0);
//# sourceMappingURL=chat.dto.js.map