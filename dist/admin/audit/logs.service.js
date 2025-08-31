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
var LogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let LogsService = LogsService_1 = class LogsService {
    auditLogRepository;
    logger = new common_1.Logger(LogsService_1.name);
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async logAction(admin, action, resourceType, resourceId, changes) {
        const logEntry = this.auditLogRepository.create({
            adminId: admin.id,
            action,
            resourceType,
            resourceId,
            beforeData: changes?.before,
            afterData: changes?.after,
        });
        await this.auditLogRepository.save(logEntry);
        this.logger.log(`Logged action: ${admin.email} -> ${action} on ${resourceType}`);
    }
    async findAll(paginationDto) {
        const { page, limit } = paginationDto;
        const [data, total] = await this.auditLogRepository.findAndCount({
            order: { timestamp: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = LogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LogsService);
//# sourceMappingURL=logs.service.js.map