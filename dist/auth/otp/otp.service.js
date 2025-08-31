"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const otp_entity_1 = require("./otp.entity");
let OtpService = class OtpService {
    otpRepo;
    constructor(otpRepo) {
        this.otpRepo = otpRepo;
    }
    generateNumericCode(length = 6) {
        return Math.floor(Math.random() * 10 ** length)
            .toString()
            .padStart(length, '0');
    }
    async generateOtp(user, channel, ttlMinutes = 15) {
        const userId = typeof user === 'string' ? user : user.id;
        const code = this.generateNumericCode(6);
        const codeHash = await bcrypt.hash(code, 10);
        const record = this.otpRepo.create({
            userId,
            channel,
            codeHash,
            expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
            consumedAt: null,
        });
        const saved = await this.otpRepo.save(record);
        return { id: saved.id, code };
    }
    async validateOtp(userId, token, channel) {
        const where = {
            userId,
            consumedAt: (0, typeorm_2.IsNull)(),
            expiresAt: (0, typeorm_2.MoreThan)(new Date()),
        };
        if (channel)
            where.channel = channel;
        const otp = await this.otpRepo.findOne({ where });
        if (!otp)
            return null;
        const ok = await bcrypt.compare(token, otp.codeHash);
        return ok ? otp : null;
    }
    async consumeOtp(id) {
        await this.otpRepo.update({ id }, { consumedAt: new Date() });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map