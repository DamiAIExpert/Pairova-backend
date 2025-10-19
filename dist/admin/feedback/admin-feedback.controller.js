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
exports.PublicFeedbackController = exports.AdminFeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_feedback_service_1 = require("./admin-feedback.service");
const jwt_auth_guard_1 = require("../../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const feedback_dto_1 = require("./dto/feedback.dto");
let AdminFeedbackController = class AdminFeedbackController {
    adminFeedbackService;
    constructor(adminFeedbackService) {
        this.adminFeedbackService = adminFeedbackService;
    }
    findAll(paginationDto, status, priority, category, search) {
        return this.adminFeedbackService.findAll(paginationDto, { status, priority, category, search });
    }
    findOne(id) {
        return this.adminFeedbackService.findOne(id);
    }
    update(id, updateFeedbackDto) {
        return this.adminFeedbackService.update(id, updateFeedbackDto);
    }
    remove(id) {
        return this.adminFeedbackService.remove(id);
    }
    getStatistics() {
        return this.adminFeedbackService.getStatistics();
    }
};
exports.AdminFeedbackController = AdminFeedbackController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of all feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of feedback retrieved successfully.', type: feedback_dto_1.FeedbackListDto }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('priority')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminFeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback details retrieved successfully.', type: feedback_dto_1.FeedbackDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminFeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update feedback item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback updated successfully.', type: feedback_dto_1.FeedbackDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", void 0)
], AdminFeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete feedback item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminFeedbackController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get feedback statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback statistics retrieved successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminFeedbackController.prototype, "getStatistics", null);
exports.AdminFeedbackController = AdminFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Controller)('admin/feedback'),
    __metadata("design:paramtypes", [admin_feedback_service_1.AdminFeedbackService])
], AdminFeedbackController);
let PublicFeedbackController = class PublicFeedbackController {
    adminFeedbackService;
    constructor(adminFeedbackService) {
        this.adminFeedbackService = adminFeedbackService;
    }
    create(createFeedbackDto) {
        return this.adminFeedbackService.create(createFeedbackDto);
    }
};
exports.PublicFeedbackController = PublicFeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit new feedback' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback submitted successfully.', type: feedback_dto_1.FeedbackDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", void 0)
], PublicFeedbackController.prototype, "create", null);
exports.PublicFeedbackController = PublicFeedbackController = __decorate([
    (0, swagger_1.ApiTags)('Public - Feedback'),
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [admin_feedback_service_1.AdminFeedbackService])
], PublicFeedbackController);
//# sourceMappingURL=admin-feedback.controller.js.map