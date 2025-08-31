// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * @class LoggingInterceptor
 * @description An interceptor that logs incoming requests and their response times.
 * This is useful for performance monitoring and debugging.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts the request and logs metadata before and after the handler is executed.
   * @param context - The execution context of the current request.
   * @param next - The next handler in the chain.
   * @returns An observable of the response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    this.logger.log(`[${method}] ${url} - Incoming request from ${ip}`);

    return next
      .handle()
      .pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `[${method}] ${url} - Request completed in ${responseTime}ms`,
          );
        }),
      );
  }
}
