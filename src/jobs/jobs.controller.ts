// src/jobs/jobs.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/strategies/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateJobDto } from './dto/create-job.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/shared/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NONPROFIT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
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
  })
  @ApiResponse({ 
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
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only nonprofit organizations can create jobs.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Access denied. Only nonprofit organizations can create jobs.',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
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
  })
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: User) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get a list of all published jobs' })
  findAll() {
    return this.jobsService.findAllPublished();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single job' })
  @ApiResponse({ status: 200, description: 'Returns the job details.'})
  @ApiResponse({ status: 404, description: 'Job not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NONPROFIT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Publish a job (change status from DRAFT to PUBLISHED)' })
  @ApiResponse({ status: 200, description: 'Job published successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only job owner can publish.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  publish(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.jobsService.publish(id, user);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.NONPROFIT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Close a job (change status to CLOSED)' })
  @ApiResponse({ status: 200, description: 'Job closed successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only job owner can close.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  close(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.jobsService.close(id, user);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured jobs' })
  @ApiResponse({ status: 200, description: 'Featured jobs retrieved successfully.' })
  getFeaturedJobs(@Query('limit') limit?: number) {
    return this.jobsService.getFeaturedJobs(limit ? parseInt(limit.toString()) : 10);
  }
}
