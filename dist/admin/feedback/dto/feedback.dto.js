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
exports.UpdateFeedbackDto = exports.CreateFeedbackDto = exports.FeedbackListDto = exports.FeedbackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const feedback_entity_1 = require("../entities/feedback.entity");
class FeedbackDto {
    id;
    title;
    description;
    category;
    status;
    priority;
    userEmail;
    userName;
    userId;
    adminNotes;
    assignedToId;
    assignedToName;
    browserInfo;
    deviceInfo;
    pageUrl;
    metadata;
    createdAt;
    updatedAt;
}
exports.FeedbackDto = FeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback ID' }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback title' }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback description' }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback category', enum: feedback_entity_1.FeedbackCategory }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback status', enum: feedback_entity_1.FeedbackStatus }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback priority', enum: feedback_entity_1.FeedbackPriority }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email who submitted feedback', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "userEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User name who submitted feedback', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID who submitted feedback', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admin notes', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "adminNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned to user ID', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "assignedToId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned to user name', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "assignedToName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Browser information', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "browserInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device information', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page URL where feedback was submitted', required: false }),
    __metadata("design:type", String)
], FeedbackDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    __metadata("design:type", Object)
], FeedbackDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], FeedbackDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], FeedbackDto.prototype, "updatedAt", void 0);
class FeedbackListDto {
    data;
    total;
    page;
    limit;
}
exports.FeedbackListDto = FeedbackListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FeedbackDto], description: 'List of feedback items' }),
    __metadata("design:type", Array)
], FeedbackListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of feedback items' }),
    __metadata("design:type", Number)
], FeedbackListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], FeedbackListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], FeedbackListDto.prototype, "limit", void 0);
class CreateFeedbackDto {
    title;
    description;
    category;
    userEmail;
    userName;
    browserInfo;
    deviceInfo;
    pageUrl;
    metadata;
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback title' }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback description' }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback category', enum: feedback_entity_1.FeedbackCategory }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email', required: false }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "userEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User name', required: false }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Browser information', required: false }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "browserInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device information', required: false }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page URL where feedback was submitted', required: false }),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "pageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }),
    __metadata("design:type", Object)
], CreateFeedbackDto.prototype, "metadata", void 0);
class UpdateFeedbackDto {
    status;
    priority;
    adminNotes;
    assignedToId;
}
exports.UpdateFeedbackDto = UpdateFeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback status', enum: feedback_entity_1.FeedbackStatus, required: false }),
    __metadata("design:type", String)
], UpdateFeedbackDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback priority', enum: feedback_entity_1.FeedbackPriority, required: false }),
    __metadata("design:type", String)
], UpdateFeedbackDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admin notes', required: false }),
    __metadata("design:type", String)
], UpdateFeedbackDto.prototype, "adminNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assigned to user ID', required: false }),
    __metadata("design:type", String)
], UpdateFeedbackDto.prototype, "assignedToId", void 0);
//# sourceMappingURL=feedback.dto.js.map