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
exports.CreateExperienceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employment_type_enum_1 = require("../../../common/enums/employment-type.enum");
class CreateExperienceDto {
    company;
    roleTitle;
    employmentType;
    locationCity;
    locationState;
    locationCountry;
    postalCode;
    startDate;
    endDate;
    description;
}
exports.CreateExperienceDto = CreateExperienceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the company.', example: 'Pairova Inc.' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title or role.', example: 'Software Engineer' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "roleTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: employment_type_enum_1.EmploymentType, description: 'Type of employment.', example: employment_type_enum_1.EmploymentType.FULL_TIME, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employment_type_enum_1.EmploymentType),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City of employment.', example: 'Lagos', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "locationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State or province of employment.', example: 'Lagos State', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "locationState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country of employment.', example: 'Nigeria', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "locationCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal or ZIP code of employment location.', example: '100001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date of employment.', example: '2021-01-15', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateExperienceDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date of employment (leave empty if current).', example: '2023-08-30', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateExperienceDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of responsibilities and achievements.', example: 'Developed key features for the main platform.', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "description", void 0);
//# sourceMappingURL=create-experience.dto.js.map