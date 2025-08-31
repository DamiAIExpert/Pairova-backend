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
exports.Page = void 0;
const typeorm_1 = require("typeorm");
const page_type_enum_1 = require("../../../common/enums/page-type.enum");
let Page = class Page {
    id;
    slug;
    title;
    type;
    content;
    heroImageUrl;
    lastPublishedAt;
    updatedBy;
    createdAt;
    updatedAt;
};
exports.Page = Page;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Page.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120, unique: true }),
    __metadata("design:type", String)
], Page.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Page.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: page_type_enum_1.PageType, default: page_type_enum_1.PageType.CUSTOM }),
    __metadata("design:type", String)
], Page.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { comment: 'Stores rich content blocks for the page' }),
    __metadata("design:type", Object)
], Page.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hero_image_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Page.prototype, "heroImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_published_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Page.prototype, "lastPublishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Page.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Page.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Page.prototype, "updatedAt", void 0);
exports.Page = Page = __decorate([
    (0, typeorm_1.Entity)('pages')
], Page);
//# sourceMappingURL=page.entity.js.map