"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const enhanced_chat_gateway_1 = require("./enhanced-chat.gateway");
const enhanced_chat_service_1 = require("./services/enhanced-chat.service");
const chat_controller_1 = require("./controllers/chat.controller");
const message_entity_1 = require("./entities/message.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const conversation_participant_entity_1 = require("./entities/conversation-participant.entity");
const message_status_entity_1 = require("./entities/message-status.entity");
const user_entity_1 = require("../users/shared/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const upload_entity_1 = require("../profiles/uploads/entities/upload.entity");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                message_entity_1.Message,
                conversation_entity_1.Conversation,
                conversation_participant_entity_1.ConversationParticipant,
                message_status_entity_1.MessageStatus,
                user_entity_1.User,
                job_entity_1.Job,
                upload_entity_1.Upload,
            ]),
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [enhanced_chat_gateway_1.EnhancedChatGateway, enhanced_chat_service_1.EnhancedChatService],
        exports: [enhanced_chat_service_1.EnhancedChatService, enhanced_chat_gateway_1.EnhancedChatGateway],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map