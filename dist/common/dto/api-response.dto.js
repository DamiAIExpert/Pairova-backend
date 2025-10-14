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
exports.ErrorResponseDto = exports.PaginatedResponseDto = exports.ApiResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponseDto {
    statusCode;
    message;
    data;
    timestamp;
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 200,
    }),
    __metadata("design:type", Number)
], ApiResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Success',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response data',
    }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the response',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "timestamp", void 0);
class PaginatedResponseDto {
    statusCode;
    message;
    data;
    meta;
    timestamp;
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 200,
    }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Success',
    }),
    __metadata("design:type", String)
], PaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of items',
        type: 'array',
    }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        example: {
            page: 1,
            limit: 20,
            total: 100,
            totalPages: 5,
            hasNext: true,
            hasPrev: false,
        },
    }),
    __metadata("design:type", Object)
], PaginatedResponseDto.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the response',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], PaginatedResponseDto.prototype, "timestamp", void 0);
class ErrorResponseDto {
    statusCode;
    message;
    error;
    details;
    timestamp;
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 400,
    }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Validation failed',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error type',
        example: 'Bad Request',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed validation errors',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'email must be a valid email address' },
                value: { type: 'string', example: 'invalid-email' },
            },
        },
        required: false,
    }),
    __metadata("design:type", Array)
], ErrorResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the error',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=api-response.dto.js.map