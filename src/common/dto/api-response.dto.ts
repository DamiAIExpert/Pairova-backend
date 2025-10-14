import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: T;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    description: 'Array of items',
    type: 'array',
  })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
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
  })
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
}
