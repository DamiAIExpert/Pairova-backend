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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jobs_service_1 = require("./jobs.service");
const jwt_auth_guard_1 = require("../auth/strategies/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/strategies/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const create_job_dto_1 = require("./dto/create-job.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/shared/user.entity");
const public_decorator_1 = require("../common/decorators/public.decorator");
let JobsController = class JobsController {
    jobsService;
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    create(createJobDto, user) {
        return this.jobsService.create(createJobDto, user);
    }
    findAll() {
        return this.jobsService.findAllPublished();
    }
    getFeaturedJobs(limit) {
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        return this.jobsService.getFeaturedJobs(parsedLimit);
    }
    findOne(id) {
        return this.jobsService.findOne(id);
    }
    publish(id, user) {
        return this.jobsService.publish(id, user);
    }
    close(id, user) {
        return this.jobsService.close(id, user);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new job posting',
        description: `
Create a new job posting. Only nonprofit organizations can create job postings.

**Frontend Integration:**
\`\`\`javascript
const createJob = async (jobData) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify(jobData)
  });
  
  if (response.ok) {
    const job = await response.json();
    console.log('Job created:', job.data);
    return job.data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Usage
const newJob = await createJob({
  title: 'Software Developer',
  description: 'Join our team to build amazing software...',
  placement: 'REMOTE',
  employmentType: 'FULL_TIME',
  salaryMin: 60000,
  salaryMax: 80000,
  currency: 'USD'
});
\`\`\`
    `
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Job successfully created.',
        schema: {
            example: {
                statusCode: 201,
                message: 'Job created successfully',
                data: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    title: 'Software Developer',
                    description: 'Join our team to build amazing software...',
                    placement: 'REMOTE',
                    employmentType: 'FULL_TIME',
                    salaryMin: 60000,
                    salaryMax: 80000,
                    currency: 'USD',
                    status: 'DRAFT',
                    createdAt: '2024-01-15T10:30:00Z',
                    updatedAt: '2024-01-15T10:30:00Z',
                    organization: {
                        id: 'org-123',
                        name: 'Tech for Good',
                        logo: 'https://example.com/logo.png'
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only nonprofit organizations can create jobs.',
        schema: {
            example: {
                statusCode: 403,
                message: 'Access denied. Only nonprofit organizations can create jobs.',
                error: 'Forbidden'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token.',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid job data provided.',
        schema: {
            example: {
                statusCode: 400,
                message: 'Validation failed',
                error: 'Bad Request',
                details: [
                    {
                        field: 'title',
                        message: 'title should not be empty'
                    }
                ]
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of all published jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Featured jobs retrieved successfully.' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getFeaturedJobs", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a single job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the job details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish a job (change status from DRAFT to PUBLISHED)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job published successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only job owner can publish.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.NONPROFIT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Close a job (change status to CLOSED)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job closed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only job owner can close.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "close", null);
exports.JobsController = JobsController = __decorate([
    (0, swagger_1.ApiTags)('Jobs'),
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map