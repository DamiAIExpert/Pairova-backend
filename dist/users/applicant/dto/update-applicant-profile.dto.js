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
exports.UpdateApplicantProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../../common/enums/gender.enum");
class UpdateApplicantProfileDto {
    firstName;
    lastName;
    gender;
    dob;
    bio;
    country;
    state;
    city;
    photoUrl;
    portfolioUrl;
}
exports.UpdateApplicantProfileDto = UpdateApplicantProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Applicant's first name", example: 'Jane', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Applicant's last name", example: 'Doe', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: gender_enum_1.Gender, description: 'Gender identity', example: gender_enum_1.Gender.FEMALE, required: false }),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of birth (YYYY-MM-DD)', example: '1995-08-24', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateApplicantProfileDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A short professional biography', example: 'Experienced NestJS developer...', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country of residence', example: 'Nigeria', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State or province', example: 'Lagos', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City of residence', example: 'Ikeja', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to profile photo', example: 'https://cdn.pairova.com/photo.jpg', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to an external portfolio', example: 'https://github.com/janedoe', required: false }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApplicantProfileDto.prototype, "portfolioUrl", void 0);
//# sourceMappingURL=update-applicant-profile.dto.js.map