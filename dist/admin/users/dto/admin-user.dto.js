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
exports.UpdateUserStatusDto = exports.AdminUserListDto = exports.AdminUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const role_enum_1 = require("../../../common/enums/role.enum");
class AdminUserDto {
    id;
    email;
    role;
    isVerified;
    phone;
    lastLoginAt;
    createdAt;
    updatedAt;
    firstName;
    lastName;
    orgName;
    photoUrl;
    logoUrl;
    city;
    country;
    applicationCount;
    jobCount;
}
exports.AdminUserDto = AdminUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role', enum: role_enum_1.Role }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user is verified' }),
    __metadata("design:type", Boolean)
], AdminUserDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp', required: false }),
    __metadata("design:type", Date)
], AdminUserDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account creation timestamp' }),
    __metadata("design:type", Date)
], AdminUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], AdminUserDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name (for applicants)', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name (for applicants)', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization name (for nonprofits)', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "orgName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profile photo URL', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Organization logo URL (for nonprofits)', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Application count for applicants', required: false }),
    __metadata("design:type", Number)
], AdminUserDto.prototype, "applicationCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job count for nonprofits', required: false }),
    __metadata("design:type", Number)
], AdminUserDto.prototype, "jobCount", void 0);
class AdminUserListDto {
    data;
    total;
    page;
    limit;
}
exports.AdminUserListDto = AdminUserListDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AdminUserDto], description: 'List of users' }),
    __metadata("design:type", Array)
], AdminUserListDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of users' }),
    __metadata("design:type", Number)
], AdminUserListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number' }),
    __metadata("design:type", Number)
], AdminUserListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], AdminUserListDto.prototype, "limit", void 0);
class UpdateUserStatusDto {
    isVerified;
    role;
    phone;
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether to verify the user', required: false }),
    __metadata("design:type", Boolean)
], UpdateUserStatusDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role', enum: role_enum_1.Role, required: false }),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    __metadata("design:type", String)
], UpdateUserStatusDto.prototype, "phone", void 0);
//# sourceMappingURL=admin-user.dto.js.map