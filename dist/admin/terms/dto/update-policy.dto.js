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
exports.UpdatePolicyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePolicyDto {
    version;
    content;
    effectiveAt;
}
exports.UpdatePolicyDto = UpdatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The new version identifier for the policy', example: 'v1.1.0' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The rich JSON content of the policy document',
        example: { blocks: [{ type: 'paragraph', data: { text: 'Welcome to Pairova.' } }] },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdatePolicyDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date this version of the policy becomes effective' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], UpdatePolicyDto.prototype, "effectiveAt", void 0);
//# sourceMappingURL=update-policy.dto.js.map