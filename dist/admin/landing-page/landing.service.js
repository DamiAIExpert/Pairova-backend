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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_entity_1 = require("../pages/entities/page.entity");
const page_type_enum_1 = require("../../common/enums/page-type.enum");
let LandingService = class LandingService {
    pageRepository;
    landingPageSlug = 'landing';
    constructor(pageRepository) {
        this.pageRepository = pageRepository;
    }
    async get() {
        const page = await this.pageRepository.findOne({ where: { slug: this.landingPageSlug } });
        if (!page) {
            return this.pageRepository.save({
                slug: this.landingPageSlug,
                title: 'Welcome to Pairova',
                type: page_type_enum_1.PageType.LANDING,
                content: { hero: { title: 'Default Title' }, sections: [] },
            });
        }
        return page;
    }
    async set(dto, admin) {
        const page = await this.get();
        const updatedPage = this.pageRepository.merge(page, dto, { updatedBy: admin.id, type: page_type_enum_1.PageType.LANDING });
        return this.pageRepository.save(updatedPage);
    }
};
exports.LandingService = LandingService;
exports.LandingService = LandingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_entity_1.Page)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LandingService);
//# sourceMappingURL=landing.service.js.map