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
exports.UpdateJobSeekerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../../common/enums/gender.enum");
class UpdateJobSeekerDto {
    isVerified;
    phone;
    firstName;
    lastName;
    gender;
    dob;
    bio;
    country;
    state;
    city;
    portfolioUrl;
}
exports.UpdateJobSeekerDto = UpdateJobSeekerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to verify the user', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateJobSeekerDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gender', enum: gender_enum_1.Gender, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth (ISO string)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bio/description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Portfolio URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJobSeekerDto.prototype, "portfolioUrl", void 0);
//# sourceMappingURL=update-job-seeker.dto.js.map