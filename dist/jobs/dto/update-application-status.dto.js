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
exports.UpdateApplicationStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const job_enum_1 = require("../../common/enums/job.enum");
class UpdateApplicationStatusDto {
    status;
    notes;
}
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the application',
        enum: job_enum_1.ApplicationStatus,
        example: job_enum_1.ApplicationStatus.REVIEWED,
    }),
    (0, class_validator_1.IsEnum)(job_enum_1.ApplicationStatus),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional notes about the status change',
        example: 'Candidate has strong technical background',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "notes", void 0);
//# sourceMappingURL=update-application-status.dto.js.map