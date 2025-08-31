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
exports.ScheduleInterviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ScheduleInterviewDto {
    applicationId;
    startAt;
    endAt;
    meetingLink;
}
exports.ScheduleInterviewDto = ScheduleInterviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The UUID of the application for the interview.' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "applicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The start date and time of the interview (ISO 8601 format).' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "startAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The end date and time of the interview (ISO 8601 format).',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "endAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A URL for the video meeting (e.g., Google Meet, Zoom).',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ScheduleInterviewDto.prototype, "meetingLink", void 0);
//# sourceMappingURL=schedule-interview.dto.js.map