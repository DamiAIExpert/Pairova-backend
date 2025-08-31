// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type HttpErrorBody =
  | string
  | {
      statusCode?: number;
      message?: string | string[];
      error?: string;
      errors?: unknown;
      [key: string]: unknown;
    };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // Determine HTTP status
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Default response structure
    const errorResponse: {
      statusCode: number;
      timestamp: string;
      path: string;
      method: string;
      message: string;
      errors: unknown | null;
    } = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req?.url ?? '',
      method: req?.method ?? '',
      message: 'Internal server error',
      errors: null,
    };

    // Extract message + extra info
    if (exception instanceof HttpException) {
      const body = exception.getResponse() as HttpErrorBody;

      if (typeof body === 'string') {
        errorResponse.message = body;
      } else if (body && typeof body === 'object') {
        // message can be string | string[]; normalize to string
        const rawMessage = body.message ?? exception.message;
        errorResponse.message = Array.isArray(rawMessage)
          ? rawMessage.join(', ')
          : String(rawMessage ?? 'Error');
        // pass through structured validation errors if present
        errorResponse.errors = body.errors ?? null;
      } else {
        errorResponse.message = exception.message;
      }
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message || 'Unexpected error';
    } else {
      errorResponse.message = 'Unexpected error';
    }

    // Log details for 5xx only (avoid leaking for client errors)
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} ${req?.method ?? ''} ${req?.url ?? ''} -> ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    }

    res.status(status).json(errorResponse);
  }
}
